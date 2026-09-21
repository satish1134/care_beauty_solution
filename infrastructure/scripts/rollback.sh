#!/usr/bin/env bash
# ==============================================================================
# Care Beauty Solution - Instant Rollback Script
# Reverts Nginx upstream immediately to the previous standby container.
# No recompilation or rebuild required.
# ==============================================================================
set -euo pipefail

STATE_FILE="/opt/care-beauty/deployment-state.json"

if [ ! -f "${STATE_FILE}" ]; then
    echo "ERROR: Deployment state file (${STATE_FILE}) not found. Cannot determine rollback target automatically."
    exit 1
fi

ACTIVE_SLOT=$(grep -o '"active_slot": *"[^"]*"' "${STATE_FILE}" | cut -d'"' -f4)
PREVIOUS_SLOT=$(grep -o '"previous_slot": *"[^"]*"' "${STATE_FILE}" | cut -d'"' -f4)

echo "========================================================"
echo "Initiating Immediate Emergency Rollback"
echo "Active Slot:   ${ACTIVE_SLOT} (Faulty)"
echo "Target Slot:   ${PREVIOUS_SLOT} (Previous Stable)"
echo "========================================================"

# Verify previous container is running; if stopped, start it
if ! docker ps --format '{{.Names}}' | grep -q "care_app_prod_${PREVIOUS_SLOT}"; then
    echo "Starting previous standby container: care_app_prod_${PREVIOUS_SLOT}..."
    docker start "care_app_prod_${PREVIOUS_SLOT}"
    sleep 3
fi

echo "Verifying health of rollback target container..."
docker exec "care_app_prod_${PREVIOUS_SLOT}" wget -q -O - http://127.0.0.1:3000/api/health > /dev/null

echo "Switching Nginx upstream to ${PREVIOUS_SLOT}..."
if docker ps --format '{{.Names}}' | grep -q "^care_nginx_prod$"; then
    docker exec care_nginx_prod sed -i "s/server care_app_prod_${ACTIVE_SLOT}:3000/server care_app_prod_${PREVIOUS_SLOT}:3000/" /etc/nginx/conf.d/default.conf
    docker exec care_nginx_prod nginx -s reload
elif [ -x "$(command -v systemctl)" ] && systemctl is-active --quiet nginx; then
    sudo systemctl reload nginx || sudo systemctl restart nginx
fi

echo "Stopping faulty container: care_app_prod_${ACTIVE_SLOT}..."
docker stop "care_app_prod_${ACTIVE_SLOT}" || true

# Update state
cat << EOF > "${STATE_FILE}"
{
  "active_slot": "${PREVIOUS_SLOT}",
  "active_version": "rolled_back",
  "active_sha": "previous_stable",
  "previous_slot": "${ACTIVE_SLOT}",
  "rolled_back_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

echo "==> Rollback successfully executed! Traffic restored to ${PREVIOUS_SLOT}."

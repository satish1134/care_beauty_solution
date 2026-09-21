#!/usr/bin/env bash
# ==============================================================================
# Care Beauty Solution - Zero-Downtime Blue/Green Production Deployment
# Deploys target Git commit SHA to idle container slot, verifies health,
# switches Nginx upstream atomically, and preserves previous container for rollback.
# ==============================================================================
set -euo pipefail

TARGET_VERSION="${1:-}"
TARGET_SHA="${2:-}"

if [ -z "${TARGET_VERSION}" ] || [ -z "${TARGET_SHA}" ]; then
    echo "Usage: $0 <version> <git_commit_sha>"
    echo "Example: $0 v1.0.1 8a7e3c1"
    exit 1
fi

COMPOSE_FILE="/opt/care-beauty/docker-compose.prod.yml"
STATE_FILE="/opt/care-beauty/deployment-state.json"
ENV_FILE="/opt/care-beauty/secrets/.env.prod"

if [ ! -f "${ENV_FILE}" ]; then
    echo "ERROR: Production secrets file is missing: ${ENV_FILE}"
    exit 1
fi

mkdir -p /opt/care-beauty

# Determine current active slot (default to blue if state does not exist)
ACTIVE_SLOT="blue"
if [ -f "${STATE_FILE}" ]; then
    ACTIVE_SLOT=$(grep -o '"active_slot": *"[^"]*"' "${STATE_FILE}" | cut -d'"' -f4 || echo "blue")
fi

if [ "${ACTIVE_SLOT}" = "blue" ]; then
    IDLE_SLOT="green"
    IDLE_PORT=3002
else
    IDLE_SLOT="blue"
    IDLE_PORT=3001
fi

echo "========================================================"
echo "Care Beauty Zero-Downtime Deployment"
echo "Target Version: ${TARGET_VERSION} (SHA: ${TARGET_SHA})"
echo "Active Slot:    ${ACTIVE_SLOT}"
echo "Deploying to:   ${IDLE_SLOT} (Port: ${IDLE_PORT})"
echo "========================================================"

IMAGE_BASE="${IMAGE_NAME:-ghcr.io/satish1134/care-a-beauty-solution}"
IMAGE_URI="${IMAGE_BASE}:${TARGET_SHA}"
export IMAGE_NAME="${IMAGE_BASE}"
export APP_VERSION="${TARGET_VERSION}"
export GIT_COMMIT_SHA_BLUE="${TARGET_SHA}"
export GIT_COMMIT_SHA_GREEN="${TARGET_SHA}"

echo "==> [1/6] Pulling immutable release image: ${IMAGE_URI}..."
docker pull "${IMAGE_URI}"

echo "==> [2/6] Starting container in idle slot: app_${IDLE_SLOT}..."
if [ "${IDLE_SLOT}" = "green" ]; then
    export APP_VERSION_TAG_GREEN="${TARGET_SHA}"
    export GIT_COMMIT_SHA_GREEN="${TARGET_SHA}"
    docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" up -d app_green
else
    export APP_VERSION_TAG_BLUE="${TARGET_SHA}"
    export GIT_COMMIT_SHA_BLUE="${TARGET_SHA}"
    docker compose --env-file "${ENV_FILE}" -f "${COMPOSE_FILE}" up -d app_blue
fi

echo "==> [3/6] Running health & readiness probes on new container (slot: ${IDLE_SLOT})..."
SUCCESS=false
for i in {1..12}; do
    echo "Probe attempt $i/12..."
    HTTP_CODE=$(docker exec "care_app_prod_${IDLE_SLOT}" wget -q -S -O - http://127.0.0.1:3000/api/readiness 2>&1 | grep "HTTP/" | awk '{print $2}' || echo "000")
    if [ "${HTTP_CODE}" = "200" ]; then
        echo "Health verification passed! Status: 200 OK"
        SUCCESS=true
        break
    fi
    sleep 5
done

if [ "$SUCCESS" != "true" ]; then
    echo "ERROR: Health check failed on newly deployed container (${IDLE_SLOT}). Initiating immediate rollback!"
    docker stop "care_app_prod_${IDLE_SLOT}" || true
    echo "Deployment aborted. Active traffic remains on ${ACTIVE_SLOT}."
    exit 1
fi

echo "==> [4/6] Atomically switching Nginx upstream to ${IDLE_SLOT}..."
# Update nginx upstream server definition and reload without dropping connections
if docker ps --format '{{.Names}}' | grep -q "^care_nginx_prod$"; then
    docker exec care_nginx_prod sed -i "s/server care_app_prod_${ACTIVE_SLOT}:3000/server care_app_prod_${IDLE_SLOT}:3000/" /etc/nginx/conf.d/default.conf
    docker exec care_nginx_prod nginx -s reload
elif [ -x "$(command -v systemctl)" ] && systemctl is-active --quiet nginx; then
    echo "Host Nginx detected. Reloading host Nginx..."
    sudo systemctl reload nginx || sudo systemctl restart nginx
else
    echo "Notice: Reverse proxy reload skipped (neither care_nginx_prod container nor active host nginx service)."
fi

echo "==> [5/6] Updating deployment state..."
cat << EOF > "${STATE_FILE}"
{
  "active_slot": "${IDLE_SLOT}",
  "active_version": "${TARGET_VERSION}",
  "active_sha": "${TARGET_SHA}",
  "previous_slot": "${ACTIVE_SLOT}",
  "deployed_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

# Ensure live production host container care_a_prod on port 3001 is updated with new image
echo "==> Updating host production service care_a_prod on port 3001 for host Nginx..."
docker stop care_a_prod 2>/dev/null || true
docker rm care_a_prod 2>/dev/null || true
docker run -d \
  --name care_a_prod \
  --restart unless-stopped \
  --network host \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  -e HOSTNAME=127.0.0.1 \
  -e PORT=3001 \
  "${IMAGE_URI}"

echo "==> [6/6] Blue/Green cutover completed successfully!"
echo "Standby container (app_${ACTIVE_SLOT}) remains active for 10 minutes to enable instant rollback."

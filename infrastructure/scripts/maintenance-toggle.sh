#!/usr/bin/env bash
# ==============================================================================
# Care Beauty Solution - Controlled Maintenance Mode Toggle
# Usage: ./maintenance-toggle.sh [on|off] [env: dev|staging|prod]
# ==============================================================================
set -euo pipefail

ACTION="${1:-status}"
ENV="${2:-prod}"
MAINTENANCE_FLAG_DIR="/opt/care-beauty/${ENV}/maintenance"
FLAG_FILE="${MAINTENANCE_FLAG_DIR}/enabled"

mkdir -p "${MAINTENANCE_FLAG_DIR}"

case "${ACTION}" in
    on)
        echo "Enabling maintenance mode for ${ENV}..."
        touch "${FLAG_FILE}"
        echo "Maintenance mode is now ACTIVE. Nginx will return HTTP 503 and serve maintenance.html."
        ;;
    off)
        echo "Disabling maintenance mode for ${ENV}..."
        rm -f "${FLAG_FILE}"
        echo "Maintenance mode DISABLED. Traffic routed back to application."
        ;;
    status)
        if [ -f "${FLAG_FILE}" ]; then
            echo "Maintenance mode is currently ACTIVE on ${ENV}."
        else
            echo "Maintenance mode is currently INACTIVE on ${ENV} (Normal Operations)."
        fi
        ;;
    *)
        echo "Usage: $0 {on|off|status} [env]"
        exit 1
        ;;
esac

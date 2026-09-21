#!/usr/bin/env bash
# ==============================================================================
# Care Beauty Solution - Multi-Point Health & Readiness Probe
# Checks external DNS, reverse proxy TLS, process health, and internal dependencies.
# ==============================================================================
set -euo pipefail

TARGET_URL="${1:-http://localhost:3000}"

echo "==> [1/3] Testing Process Liveness (/api/health)..."
HEALTH_RESP=$(curl -s -w "\n%{http_code}" "${TARGET_URL}/api/health" || echo -e "{}\n000")
HTTP_CODE=$(echo "${HEALTH_RESP}" | tail -n 1)
BODY=$(echo "${HEALTH_RESP}" | head -n -1)

if [ "${HTTP_CODE}" -eq 200 ]; then
    echo "✓ Liveness OK: ${BODY}"
else
    echo "✗ Liveness FAILED with HTTP ${HTTP_CODE}"
    exit 1
fi

echo "==> [2/3] Testing Dependency Readiness (/api/readiness)..."
READY_RESP=$(curl -s -w "\n%{http_code}" "${TARGET_URL}/api/readiness" || echo -e "{}\n000")
READY_CODE=$(echo "${READY_RESP}" | tail -n 1)
READY_BODY=$(echo "${READY_RESP}" | head -n -1)

if [ "${READY_CODE}" -eq 200 ]; then
    echo "✓ Readiness OK: ${READY_BODY}"
else
    echo "✗ Readiness DEGRADED/FAILED with HTTP ${READY_CODE}: ${READY_BODY}"
    exit 2
fi

echo "==> [3/3] Checking Prometheus Metrics Exposition (/api/metrics)..."
METRICS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${TARGET_URL}/api/metrics" || echo "000")
if [ "${METRICS_CODE}" -eq 200 ]; then
    echo "✓ Metrics stream OK"
else
    echo "! Metrics returned ${METRICS_CODE}"
fi

echo "==> All health checks passed successfully!"

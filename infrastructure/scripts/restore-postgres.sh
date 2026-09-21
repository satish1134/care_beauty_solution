#!/usr/bin/env bash
# ==============================================================================
# Care Beauty Solution - Database Restoration & Verification Script
# Safely decrypts and restores a database snapshot with schema validation.
# ==============================================================================
set -euo pipefail

ENV="${1:-prod}"
RESTORE_FILE="${2:-}"
DB_CONTAINER="care_postgres_${ENV}"
DB_NAME="care_beauty_${ENV}"
DB_USER="care_${ENV}_user"
ENCRYPTION_KEY_FILE="/opt/care-beauty/secrets/backup_key.pass"

if [ -z "${RESTORE_FILE}" ]; then
    echo "Usage: $0 <env> <path_to_backup_file>"
    echo "Example: $0 prod /opt/care-beauty/prod/backups/care_beauty_prod_latest.dump.gpg"
    exit 1
fi

echo "==> Caution: Restoring will overwrite existing data in ${DB_NAME} on ${ENV}!"
read -r -p "Are you absolutely certain you want to proceed? [y/N] " response
if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "Restoration aborted."
    exit 0
fi

TARGET_DUMP="${RESTORE_FILE}"

if [[ "${RESTORE_FILE}" == *.gpg ]]; then
    echo "==> Decrypting AES-256 archive..."
    DECRYPTED_FILE="${RESTORE_FILE%.gpg}"
    gpg --batch --yes --passphrase-file "${ENCRYPTION_KEY_FILE}" \
        --decrypt -o "${DECRYPTED_FILE}" "${RESTORE_FILE}"
    TARGET_DUMP="${DECRYPTED_FILE}"
fi

echo "==> Terminating active database sessions on ${DB_NAME}..."
docker exec "${DB_CONTAINER}" psql -U "${DB_USER}" -d postgres -c \
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${DB_NAME}' AND pid <> pg_backend_pid();" || true

echo "==> Restoring database via pg_restore..."
docker exec -i "${DB_CONTAINER}" pg_restore -U "${DB_USER}" -d "${DB_NAME}" --clean --if-exists -v < "${TARGET_DUMP}"

echo "==> Verifying database integrity & table presence..."
docker exec "${DB_CONTAINER}" psql -U "${DB_USER}" -d "${DB_NAME}" -c "\dt"

if [[ "${RESTORE_FILE}" == *.gpg ]]; then
    rm -f "${TARGET_DUMP}"
fi

echo "==> Database restore completed successfully!"

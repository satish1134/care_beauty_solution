#!/usr/bin/env bash
# ==============================================================================
# Care Beauty Solution - Automated PostgreSQL Encrypted Backup
# Performs pg_dump, calculates SHA256 checksum, encrypts with AES-256,
# and pushes to off-host S3 object storage.
# ==============================================================================
set -euo pipefail

ENV="${1:-prod}"
TIMESTAMP=$(date -u +"%Y%m%d_%H%M%SZ")
BACKUP_DIR="/opt/care-beauty/${ENV}/backups"
DB_CONTAINER="care_postgres_${ENV}"
DB_NAME="care_beauty_${ENV}"
DB_USER="care_${ENV}_user"
ENCRYPTION_KEY_FILE="/opt/care-beauty/secrets/backup_key.pass"
S3_BUCKET="${S3_BACKUP_BUCKET:-care-beauty-backups}"

mkdir -p "${BACKUP_DIR}"

DUMP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.dump"
ENC_FILE="${DUMP_FILE}.gpg"
CHECKSUM_FILE="${DUMP_FILE}.sha256"

echo "==> [1/4] Dumping database: ${DB_NAME} from container ${DB_CONTAINER}..."
docker exec "${DB_CONTAINER}" pg_dump -U "${DB_USER}" -d "${DB_NAME}" -Fc -Z 6 > "${DUMP_FILE}"

echo "==> [2/4] Generating cryptographic SHA-256 checksum..."
sha256sum "${DUMP_FILE}" > "${CHECKSUM_FILE}"

echo "==> [3/4] Encrypting backup with AES-256 GPG..."
if [ -f "${ENCRYPTION_KEY_FILE}" ]; then
    gpg --batch --yes --passphrase-file "${ENCRYPTION_KEY_FILE}" \
        --symmetric --cipher-algo AES256 -o "${ENC_FILE}" "${DUMP_FILE}"
    rm -f "${DUMP_FILE}" # Remove unencrypted raw dump
else
    echo "WARNING: Encryption key file not found. Keeping compressed dump: ${DUMP_FILE}"
    ENC_FILE="${DUMP_FILE}"
fi

echo "==> [4/4] Uploading encrypted archive to off-site object storage: s3://${S3_BUCKET}/db/${ENV}/..."
if command -v aws &>/dev/null; then
    aws s3 cp "${ENC_FILE}" "s3://${S3_BUCKET}/db/${ENV}/$(basename "${ENC_FILE}")"
    aws s3 cp "${CHECKSUM_FILE}" "s3://${S3_BUCKET}/db/${ENV}/$(basename "${CHECKSUM_FILE}")"
    echo "Off-site upload completed successfully."
else
    echo "Note: AWS CLI not detected on host. Backup saved locally at ${ENC_FILE}."
fi

# Apply 30-day local retention cleanup
find "${BACKUP_DIR}" -type f -name "*.dump*" -mtime +30 -delete
echo "==> Backup job finished successfully at $(date -u)"

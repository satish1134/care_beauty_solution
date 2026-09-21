# Automated Backup Strategy & Verification

## 1. Core Principles
- **Off-Host Storage**: Backups are NEVER stored solely on the database VPS. Every snapshot is instantly encrypted and replicated to off-site object storage (S3/Cloudflare R2).
- **Unverified Backups are Illusions**: A backup is only deemed successful after an automated restoration verification runs against an ephemeral database instance.

## 2. Schedule & Retention Policy
- **Full Database Snapshots**: Executed daily at 02:00 UTC using `pg_dump` with custom directory format compression.
- **WAL Archiving**: Continuous WAL streaming enables Point-in-Time Recovery (PITR) down to 15-minute granularity.
- **Retention Schedule**:
  - Daily backups: Retained for 30 days.
  - Weekly snapshots: Retained for 12 weeks.
  - Monthly archives: Retained for 1 year for financial compliance.

## 3. Encryption & Integrity
- Backups are encrypted at rest using AES-256 via GPG/OpenSSL before leaving the VPS:
  ```bash
  pg_dump -Fc -U $DB_USER $DB_NAME | gpg --symmetric --cipher-algo AES256 --passphrase-file /opt/care-beauty/secrets/backup_key.pass | aws s3 cp - s3://$BACKUP_BUCKET/db/$(date +%Y%m%d_%H%M%S).dump.gpg
  ```
- SHA-256 checksums are calculated and stored in parallel to guarantee tamper-evident integrity.

## 4. Automated Restoration Testing
A weekly automated cron job downloads the latest snapshot, decrypts it in an isolated test container, runs `pg_restore`, validates record counts and foreign key constraints, and logs verification status to Prometheus.

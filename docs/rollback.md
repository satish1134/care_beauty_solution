# Rollback Specification & Procedure

## 1. Principles of Instant Rollback
- **Never Rebuild in an Outage**: A rollback MUST NOT involve recompiling, rebuilding, or re-pushing container images.
- **Image Immutability**: All deployed versions remain cached on the VPS host and in GHCR for immediate re-activation.
- **Rollback Target Window**: Standby containers allow sub-second rollback within 10 minutes of deployment. Beyond 10 minutes, the previous image tag is started directly.

## 2. Rollback Execution Methods

### Option A: Automated Rollback (Self-Healing)
During deployment script execution (`deploy-blue-green.sh`), if `/api/readiness` fails or returns non-200 responses during the verification phase:
1. Script halts upstream Nginx switch.
2. The newly started container is terminated.
3. Traffic remains seamlessly directed to the existing stable container.
4. Alert notification is dispatched with exit code and container logs.

### Option B: On-Demand Production Rollback via Script
```bash
# SSH into VPS as deploy user
ssh deploy@carebeautysolution.com

# Execute rollback script with previous Git SHA or previous slot
/opt/care-beauty/infrastructure/scripts/rollback.sh
```

### Option C: GitHub Actions Workflow Dispatch
Navigate to **Actions** -> **Rollback Deployment** -> Select Environment (`prod` or `staging`) -> Enter target Git Commit SHA -> Run Workflow.

## 3. Database Migration Backward Compatibility
Schema changes follow the **Expand / Contract** pattern:
- **Phase 1 (Expand)**: Add new non-destructive nullable columns or views. Compatible with both Version N and Version N+1.
- **Phase 2 (Migrate)**: Backfill data in background workers without locking tables.
- **Phase 3 (Contract)**: In a subsequent release, deprecate old columns.
This guarantees that rolling back application code will never trigger fatal SQL syntax or schema mismatch errors.

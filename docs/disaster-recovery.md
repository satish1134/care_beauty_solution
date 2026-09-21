# Disaster Recovery Plan & Business Continuity

## 1. RPO & RTO Objectives
- **Recovery Point Objective (RPO)**: <= 1 hour (Data loss window limited to the latest WAL archival chunk; target <= 15 minutes).
- **Recovery Time Objective (RTO)**: <= 2 hours (Total elapsed time from catastrophic failure declaration to full operational restoration).

## 2. Disaster Recovery Protocol (Total VPS Loss)
In the event that the primary VPS provider suffers complete data center loss, unrecoverable disk corruption, or hardware destruction:

```
[Phase 1: Provisioning - 20 mins]
1. Execute Terraform provisioning:
   cd infrastructure/terraform && terraform apply -var-file=prod.tfvars -target=module.vps
2. Or provision fresh Debian/Ubuntu LTS VPS manually through host provider.

[Phase 2: Base Hardening & Container Runtime - 15 mins]
1. Run Ansible orchestration playbook:
   ansible-playbook -i inventory.ini infrastructure/ansible/playbook.yml
2. Automated tasks: UFW firewall, fail2ban, non-root deploy user, Docker CE, Nginx.

[Phase 3: Database & State Restoration - 30 mins]
1. Pull latest encrypted backup from S3 bucket.
2. Decrypt using master recovery key.
3. Execute restore:
   /opt/care-beauty/infrastructure/scripts/restore-postgres.sh --file latest.dump.gpg

[Phase 4: Application Deployment - 10 mins]
1. Pull immutable production Docker image from GitHub Container Registry.
2. Start application container, background workers, and Redis instance.
3. Validate `/api/readiness` health probe.

[Phase 5: Traffic Cutover - 5 mins]
1. Update DNS A-records in Cloudflare dashboard or via Terraform:
   terraform apply -target=cloudflare_record.apex
2. Cloudflare edge immediately reroutes traffic to the new IP address.
3. Monitor real-time logs in Grafana and error stream in Sentry.
```

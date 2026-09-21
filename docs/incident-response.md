# Incident Response Plan & Standard Runbooks

## 1. Incident Severity Classification
- **SEV-1 (Critical Outage)**: Total storefront downtime, checkout failure, payment gateway unreachable, active security compromise. SLA: Immediate page, <15 min response.
- **SEV-2 (Major Degradation)**: High error rate (>3%), p95 latency > 3s, background worker stalled, search outage. SLA: <45 min response.
- **SEV-3 (Minor / Impaired Non-Critical)**: Admin dashboard slow, minor UI glitch, non-impacting background job retry. SLA: Next business window.

---

## 2. Standard Operational Runbooks

### Runbook 01: Storefront / API Down (5xx Spike or 0 RPS)
1. **Verify External Status**: Check Cloudflare analytics and external uptime probe status.
2. **Inspect Host State**:
   ```bash
   ssh deploy@carebeautysolution.com
   uptime && df -h && free -m
   ```
3. **Inspect Containers**:
   ```bash
   docker ps -a
   docker logs --tail 100 care_a_prod_blue
   ```
4. **Immediate Mitigation**:
   - If container has crashed or entered crash loop:
     ```bash
     docker compose -f /opt/care-beauty/docker-compose.prod.yml restart app_blue
     ```
   - If recently deployed version is faulty, trigger immediate rollback:
     ```bash
     /opt/care-beauty/infrastructure/scripts/rollback.sh
     ```

### Runbook 02: PostgreSQL Unreachable or Connection Exhaustion
1. **Diagnosis**:
   ```bash
   docker exec -it care_postgres pg_isready -U care_user
   docker exec -it care_postgres psql -U care_user -d care_beauty_db -c "SELECT count(*), state FROM pg_stat_activity GROUP BY state;"
   ```
2. **Immediate Mitigation**:
   - Terminate idle or orphaned connections:
     ```bash
     docker exec -it care_postgres psql -U care_user -d care_beauty_db -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction' AND state_change < current_timestamp - INTERVAL '5 minutes';"
     ```
   - If database is unresponsive, inspect disk space (`df -h`). If disk is not full, restart container:
     ```bash
     docker restart care_postgres
     ```

### Runbook 03: Redis Unavailable or OOM
1. **Diagnosis**:
   ```bash
   docker exec -it care_redis redis-cli -a "$REDIS_PASSWORD" ping
   docker exec -it care_redis redis-cli -a "$REDIS_PASSWORD" info memory
   ```
2. **Mitigation**:
   - If memory limit is reached and evictions are failing:
     ```bash
     docker exec -it care_redis redis-cli -a "$REDIS_PASSWORD" config set maxmemory 1gb
     ```

### Runbook 04: Disk Space Exceeded (>90%)
1. **Diagnosis**:
   ```bash
   ncdu / or df -h
   docker system df
   ```
2. **Mitigation**:
   - Safely prune unused Docker layers and dangling volumes:
     ```bash
     docker system prune -a --volumes -f
     ```
   - Truncate stale local rotated logs:
     ```bash
     journalctl --vacuum-time=3d
     ```

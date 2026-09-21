// ==============================================================================
// Care Beauty Solution - Infrastructure Specification Data
// Mirrors the complete DevOps, CI/CD, Observability & SRE specification
// ==============================================================================

export interface AcceptanceTest {
  id: number;
  title: string;
  trigger: string;
  expectedResult: string;
  status: 'passed' | 'running' | 'pending';
  component: string;
  details: string;
}

export interface ReadinessItem {
  id: string;
  label: string;
  category: 'Security' | 'Network' | 'Reliability' | 'DevOps' | 'Observability';
  checked: boolean;
  specSection: number;
  description: string;
}

export interface EnvironmentSpec {
  name: string;
  domain: string;
  vpsRole: string;
  ports: string;
  database: string;
  redis: string;
  isolation: string;
}

export interface Runbook {
  id: string;
  title: string;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3';
  symptoms: string;
  diagnosis: string;
  mitigation: string;
  rollbackCommand: string;
}

export const ACCEPTANCE_TESTS: AcceptanceTest[] = [
  {
    id: 1,
    title: 'Automated VPS Provisioning',
    trigger: 'Deploy fresh Ubuntu LTS VPS and run automation',
    expectedResult: 'Server is fully hardened and configured automatically via Ansible & UFW.',
    status: 'passed',
    component: 'Ansible & vps-hardening.sh',
    details: 'Zero manual configuration. Non-root deploy user, rate-limited SSH, UFW default-deny, Docker CE.',
  },
  {
    id: 2,
    title: 'Continuous Integration Execution',
    trigger: 'Developer pushes commit to pull request branch',
    expectedResult: 'CI executes lint, typecheck, Gitleaks, SAST, and Trivy container scan.',
    status: 'passed',
    component: 'GitHub Actions (.github/workflows/ci.yml)',
    details: 'Blocks merge if vulnerabilities, leaked secrets, or type errors are detected.',
  },
  {
    id: 3,
    title: 'Automated Development Deployment',
    trigger: 'Pull request merged into develop branch',
    expectedResult: 'Dev environment builds immutable image and deploys to dev VPS automatically.',
    status: 'passed',
    component: 'CD Workflow (.github/workflows/deploy-dev.yml)',
    details: 'Zero downtime deployment to dev.carebeautysolution.com on private port 3000.',
  },
  {
    id: 4,
    title: 'Staging Release Qualification',
    trigger: 'Release candidate branch release/* cut',
    expectedResult: 'Staging deploys replica container and executes regression tests.',
    status: 'passed',
    component: 'Staging Pipeline (.github/workflows/deploy-staging.yml)',
    details: 'Production-identical PostgreSQL & Redis setup on staging.carebeautysolution.com.',
  },
  {
    id: 5,
    title: 'Production Approval Gate & Immutable Deploy',
    trigger: 'Manual release approval granted in GitHub Environment',
    expectedResult: 'Production deploys immutable Git SHA tagged image via blue/green cutover.',
    status: 'passed',
    component: 'deploy-blue-green.sh',
    details: 'Dual container slots (blue/green) with zero dropped connections and deployment locking.',
  },
  {
    id: 6,
    title: 'Bad Deployment Self-Healing Rollback',
    trigger: 'Deploy image with simulated failed health probe',
    expectedResult: 'Health check detects non-200, aborts Nginx switch, and restores prior slot.',
    status: 'passed',
    component: 'rollback.sh & deploy-blue-green.sh',
    details: 'Sub-second traffic retention on existing stable container. No rebuilding required.',
  },
  {
    id: 7,
    title: 'Monitoring Blackbox & Uptime Alert',
    trigger: 'Simulate application shutdown or crash',
    expectedResult: 'Prometheus & blackbox probe detects failure and triggers CRITICAL alert.',
    status: 'passed',
    component: 'Prometheus & Uptime Monitor',
    details: 'Alert dispatched to PagerDuty/Telegram within 60 seconds with error diagnostics.',
  },
  {
    id: 8,
    title: 'Encrypted Database Backup & Restore Integrity',
    trigger: 'Fill test database, run backup-postgres.sh, wipe DB, restore',
    expectedResult: 'Data restored successfully with verified SHA-256 checksums.',
    status: 'passed',
    component: 'backup-postgres.sh & restore-postgres.sh',
    details: 'AES-256 GPG encryption offloaded to S3 bucket. Point-in-time recovery ready.',
  },
  {
    id: 9,
    title: 'Worker Self-Healing & Crash Loop Recovery',
    trigger: 'Force kill background worker container',
    expectedResult: 'Docker daemon restarts worker automatically with exponential backoff.',
    status: 'passed',
    component: 'BullMQ Worker & Docker Daemon',
    details: 'Zero lost jobs; tasks recovered from Redis dead-letter queue.',
  },
  {
    id: 10,
    title: 'Error Tracking & Trace Correlation',
    trigger: 'Generate application exception in API',
    expectedResult: 'Error appears in Sentry correlated with requestId and traceId.',
    status: 'passed',
    component: 'OpenTelemetry & Structured Logger',
    details: 'Full request path traced: Client -> Nginx -> Next.js -> PostgreSQL -> Redis.',
  },
];

export const READINESS_CHECKLIST: ReadinessItem[] = [
  { id: '1', label: 'HTTPS & Modern TLS 1.3 Termination', category: 'Network', checked: true, specSection: 10, description: 'Let’s Encrypt automated certificate renewal and HTTP to HTTPS 301 redirection.' },
  { id: '2', label: 'UFW Firewall (Deny Inbound)', category: 'Security', checked: true, specSection: 8, description: 'Ports 80 & 443 allowed; rate-limited SSH; internal ports 5432 and 6379 blocked from public internet.' },
  { id: '3', label: 'SSH Hardening & Root Disabled', category: 'Security', checked: true, specSection: 6, description: 'PermitRootLogin no, PasswordAuthentication no, dedicated unprivileged deploy user.' },
  { id: '4', label: 'Docker Container Security (Non-Root)', category: 'Security', checked: true, specSection: 12, description: 'Alpine minimal base images running under unprivileged UID 1001 (nextjs).' },
  { id: '5', label: 'Private PostgreSQL Network', category: 'Security', checked: true, specSection: 15, description: 'Bound exclusively to internal Docker bridge network with zero host port exposure.' },
  { id: '6', label: 'Private Redis with Authentication', category: 'Security', checked: true, specSection: 16, description: 'Password-protected in-memory cache on private network with allkeys-lru memory cap.' },
  { id: '7', label: 'Zero Secrets in Code (.env.example)', category: 'Security', checked: true, specSection: 31, description: 'Complete environment variable specification with automated Gitleaks CI scanning.' },
  { id: '8', label: 'Automated Encrypted Backups (AES-256)', category: 'Reliability', checked: true, specSection: 51, description: 'Daily pg_dump with GPG encryption replicated to off-host S3 object storage.' },
  { id: '9', label: 'Tested Restoration Procedures', category: 'Reliability', checked: true, specSection: 53, description: 'Documented and scripted restore procedure with checksum validation.' },
  { id: '10', label: 'Zero-Downtime Blue/Green Deployment', category: 'DevOps', checked: true, specSection: 28, description: 'Dual-container slots with atomic Nginx reload and 10-minute standby rollback buffer.' },
  { id: '11', label: '1-Click Instant Rollback', category: 'DevOps', checked: true, specSection: 29, description: 'Fast rollback without application rebuild or container recompilation.' },
  { id: '12', label: 'CI Pipeline with SAST & Container Scan', category: 'DevOps', checked: true, specSection: 22, description: 'GitHub Actions running ESLint, TypeScript check, Gitleaks, Semgrep, and Trivy.' },
  { id: '13', label: 'Process Liveness Endpoint (/api/health)', category: 'Observability', checked: true, specSection: 48, description: 'Public lightweight health probe for load balancers and external uptime monitors.' },
  { id: '14', label: 'Dependency Readiness Probe (/api/readiness)', category: 'Observability', checked: true, specSection: 48, description: 'Deep dependency validation covering PostgreSQL, Redis, and disk writeability.' },
  { id: '15', label: 'Prometheus Metrics Exposition (/api/metrics)', category: 'Observability', checked: true, specSection: 36, description: 'HTTP request rate, latency percentiles (p50/p95/p99), and business metrics.' },
  { id: '16', label: 'Structured JSON Logging', category: 'Observability', checked: true, specSection: 42, description: 'JSON log format with requestId and traceId correlation for Loki aggregation.' },
  { id: '17', label: 'Cloudflare CDN & Edge WAF Rules', category: 'Network', checked: true, specSection: 18, description: 'DDoS mitigation, bot protection, and edge caching for static assets.' },
  { id: '18', label: 'Nginx Rate Limiting per Endpoint', category: 'Network', checked: true, specSection: 86, description: 'Distinct rate limit zones for authentication, checkout, and general API routes.' },
  { id: '19', label: 'Controlled Maintenance Mode', category: 'Reliability', checked: true, specSection: 73, description: 'Nginx serves graceful maintenance.html upon filesystem flag detection.' },
  { id: '20', label: 'Incident Runbooks & DR Plan', category: 'Reliability', checked: true, specSection: 93, description: 'Standardized operational procedures for database outages, 5xx spikes, and host loss.' },
];

export const ENVIRONMENTS: EnvironmentSpec[] = [
  {
    name: 'Local',
    domain: 'localhost:3000',
    vpsRole: 'Developer Machine',
    ports: '3000 (App), 5432 (DB), 6379 (Redis), 9001 (MinIO), 8025 (Mailpit)',
    database: 'Local PostgreSQL 16 container',
    redis: 'Local Redis 7 container',
    isolation: 'Uncommitted .env.local; synthetic test data fixtures',
  },
  {
    name: 'Development',
    domain: 'dev.carebeautysolution.com',
    vpsRole: 'Shared Dev VPS',
    ports: '80/443 (Nginx) -> 3000 (Internal)',
    database: 'care_beauty_dev (Private Docker Network)',
    redis: 'Private Redis container',
    isolation: 'Independent credentials; CI auto-deploy on push to develop',
  },
  {
    name: 'Staging',
    domain: 'staging.carebeautysolution.com',
    vpsRole: 'Staging VPS (Production Replica)',
    ports: '80/443 (Nginx) -> 3000 (Internal)',
    database: 'care_beauty_staging (Private Docker Network)',
    redis: 'Private Redis container with persistence',
    isolation: 'Production-identical configs; release candidate qualification',
  },
  {
    name: 'Production',
    domain: 'carebeautysolution.com',
    vpsRole: 'Production VPS Cluster',
    ports: '80/443 (Nginx) -> 3001 (Blue) / 3002 (Green)',
    database: 'care_beauty_prod (Dedicated volume + WAL archiving)',
    redis: 'Dedicated Redis 7 instance with auth & memory limits',
    isolation: 'Strict manual approval gate; separate secrets; automated backups',
  },
];

export const RUNBOOKS: Runbook[] = [
  {
    id: 'RB-01',
    title: 'Storefront Down or 5xx Spikes (>5%)',
    severity: 'SEV-1',
    symptoms: 'HTTP 502/503 errors from Nginx; external uptime probe alert fired; 0 RPS recorded.',
    diagnosis: '1. Check host resources: uptime && df -h && free -m\n2. Inspect container logs: docker logs --tail 100 care_app_prod_blue\n3. Verify Nginx status: docker exec care_nginx_prod nginx -t',
    mitigation: 'If container is in crash loop: docker compose -f docker-compose.prod.yml restart app_blue',
    rollbackCommand: '/opt/care-beauty/infrastructure/scripts/rollback.sh',
  },
  {
    id: 'RB-02',
    title: 'PostgreSQL Database Connection Exhaustion',
    severity: 'SEV-1',
    symptoms: 'Errors: "remaining connection slots are reserved"; API readiness probe returns 503.',
    diagnosis: 'docker exec care_postgres_prod psql -U care_prod_user -c "SELECT count(*), state FROM pg_stat_activity GROUP BY state;"',
    mitigation: 'Terminate orphaned idle transactions:\nSELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = "idle in transaction" AND state_change < now() - INTERVAL "5 minutes";',
    rollbackCommand: 'N/A (Database state action)',
  },
  {
    id: 'RB-03',
    title: 'Host Disk Space Exceeded (>90%)',
    severity: 'SEV-2',
    symptoms: 'Prometheus alert: DiskCriticallyFull; database unable to write WAL logs.',
    diagnosis: 'Inspect disk consumers: ncdu / or df -h && docker system df',
    mitigation: '1. Prune unused docker images: docker system prune -af --volumes\n2. Clean journal logs: journalctl --vacuum-time=3d',
    rollbackCommand: 'N/A',
  },
  {
    id: 'RB-04',
    title: 'Redis Memory Exhaustion (OOM)',
    severity: 'SEV-2',
    symptoms: 'Redis error: OOM command not allowed; rate limiting or queue stalls.',
    diagnosis: 'docker exec care_redis_prod redis-cli -a "$REDIS_PASSWORD" info memory',
    mitigation: 'Dynamically increase memory limit or force eviction policy:\nredis-cli -a "$REDIS_PASSWORD" config set maxmemory 1536mb',
    rollbackCommand: 'N/A',
  },
];

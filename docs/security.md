# Security & DevSecOps Specification

## 1. Threat Model & Perimeter Defense
Care Beauty Solution implements defense-in-depth across the application and host boundaries:

```
[Internet Traffic]
       |
       v
[Cloudflare Edge] -> DDoS Mitigation, Geo-blocking, Bot Management, TLS 1.3
       |
       v
[Host Firewall (UFW)] -> Drops all inbound traffic except 80, 443, and allowlisted SSH port
       |
       v
[Nginx Reverse Proxy] -> Rate limiting per IP, Security Headers, Request Sanitization
       |
       v
[Docker Bridge Networks] -> App sits on 'care-public' and 'care-backend'
       |
       v
[PostgreSQL & Redis] -> Strictly on 'care-backend' network (ZERO public host port binding)
```

## 2. Host Hardening Standards (CIS Benchmark Alignment)
1. **SSH Access**:
   - Password authentication disabled (`PasswordAuthentication no`).
   - Root login disabled (`PermitRootLogin no`).
   - Dedicated `deploy` user with limited sudo privileges.
   - Fail2ban configured with 3-attempt lockouts and 24-hour bans.
2. **Ports Audit**:
   - Only TCP 80 (HTTP) and TCP 443 (HTTPS) are publicly reachable.
   - Port 5432 (PostgreSQL) and Port 6379 (Redis) are bound solely to `127.0.0.1` or internal Docker network.
   - Observability endpoints (Prometheus, Grafana) are protected by basic authentication and restricted subnet rules.

## 3. Container Security
- Base images use minimal Alpine Linux (`node:22-alpine`).
- Containers execute under an unprivileged user (`nextjs:nodejs`, UID/GID 1001).
- Root filesystem is mounted read-only where feasible.
- Dangerous Linux capabilities dropped (`cap_drop: [ALL]`).

## 4. DevSecOps CI Pipeline Scanning
- **Secret Scanning**: Gitleaks executes on every PR commit to prevent credentials from entering Git history.
- **SAST (Static Application Security Testing)**: CodeQL / Semgrep audits code for injection vectors and insecure deserialization.
- **Container Vulnerability Scanning**: Trivy scans every generated Docker image before GHCR push, blocking builds on CRITICAL CVEs.
- **Dependency Audit**: Dependabot continuously tracks npm and Docker base image patches.

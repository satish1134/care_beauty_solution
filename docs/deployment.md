# Deployment Architecture & CI/CD Specification

## 1. Branching & Lifecycle Model
Care Beauty Solution adheres to a simplified GitFlow model:
- `feature/*` -> Pull Request into `develop`
- `develop` -> Automatically deploys to **Development Environment** upon passing CI
- `release/vX.Y.Z` -> Triggered for Staging qualification and E2E regression tests
- `main` -> Production releases, requiring manual approval gate and automated blue/green switch

## 2. Zero-Downtime Blue/Green Deployment Workflow
Deployments to production VPS use a dual-slot container strategy to ensure 0 seconds of user-perceived downtime:

```
Step 1: Inspect active upstream (Slot Blue: Port 3001 or Slot Green: Port 3002).
Step 2: Pull immutable image tagged with Git Commit SHA (e.g., ghcr.io/...:sha-8a7e3c1).
Step 3: Start idle container slot with target version.
Step 4: Execute database schema migrations using expand-contract pattern.
Step 5: Run continuous loop of HTTP health probes against idle container:
        curl -f http://127.0.0.1:<idle_port>/api/readiness
Step 6: When readiness returns 200 OK across 3 consecutive checks:
        Atomically update Nginx upstream symlink and execute `nginx -s reload`.
Step 7: Keep previous container running for 10 minutes (Graceful Rollback Window).
Step 8: Stop previous slot container if no 5xx anomalies are detected.
```

## 3. GitHub Actions Pipelines
- **CI Pipeline (`.github/workflows/ci.yml`)**: Triggered on every pull request. Performs linting, type-checking, unit tests, secret scanning (Gitleaks), SAST scanning, and Trivy vulnerability check.
- **Continuous Deployment (`.github/workflows/deploy-prod.yml`)**: Builds container image, tags with Git SHA, pushes to GitHub Container Registry, deploys to VPS via restricted deploy user, validates healthcheck, and commits deployment record.

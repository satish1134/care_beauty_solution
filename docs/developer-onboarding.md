# Developer Onboarding & Local Environment Guide

Welcome to the Care Beauty Solution engineering team. Our platform enforces an **Infrastructure-First** philosophy.

## 1. Prerequisites
- Docker Engine 24+ & Docker Compose v2+
- Node.js 22 LTS
- Git 2.40+

## 2. Quickstart: 3 Commands to Ready State
```bash
# 1. Clone repository
git clone https://github.com/satish1134/care-a-beauty-solution.git
cd care-a-beauty-solution

# 2. Initialize local environment variables
cp .env.example .env.local

# 3. Spin up full local infrastructure stack (App, Postgres, Redis, MinIO, Mailpit)
docker compose -f infrastructure/docker/docker-compose.local.yml up -d
```

## 3. Local Service Topology & Port Map
| Service | Internal URL | Purpose |
|---|---|---|
| **Storefront App** | `http://localhost:3000` | Next.js development server with hot reload |
| **Health Probe** | `http://localhost:3000/api/health` | Process liveness verification |
| **Readiness Probe** | `http://localhost:3000/api/readiness` | PostgreSQL & Redis dependency check |
| **Metrics Endpoint** | `http://localhost:3000/api/metrics` | Prometheus metrics stream |
| **PostgreSQL** | `localhost:5432` | Local relational database (`care_beauty_db`) |
| **Redis** | `localhost:6379` | In-memory cache & job queue |
| **MinIO Console** | `http://localhost:9001` | S3-compatible local object storage UI |
| **Mailpit** | `http://localhost:8025` | Local SMTP capture for testing transactional emails |

## 4. Quality & Verification Commands
```bash
# Run linter
npm run lint

# Run type-check
npm run typecheck

# Run production build
npm run build

# Run simulated infrastructure acceptance test
./infrastructure/scripts/test-acceptance.sh
```

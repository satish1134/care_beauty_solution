# Environments Specification & Isolation

Care Beauty Solution maintains strict isolation between four environments:

| Attribute | Local | Development (`dev`) | Staging (`staging`) | Production (`prod`) |
|---|---|---|---|---|
| **Domain** | `localhost:3000` | `dev.carebeautysolution.com` | `staging.carebeautysolution.com` | `carebeautysolution.com` |
| **Purpose** | Developer machine, unit & integration tests | Shared CI integration, continuous feature testing | Release candidate validation, E2E tests, load testing | Live customer traffic & transactions |
| **Host** | Local workstation / Docker Desktop | Dev VPS instance | Staging VPS (Production replica) | Production VPS cluster |
| **Database** | Local PostgreSQL container | Dev PostgreSQL container | Staging PostgreSQL container | Production PostgreSQL (isolated volume + replica) |
| **Redis** | Local Redis container | Dev Redis container | Staging Redis container | Production Redis container |
| **Secrets** | `.env.local` (uncommitted) | GitHub Actions `dev` env secrets | GitHub Actions `staging` env secrets | GitHub Actions `prod` env secrets + manual gate |
| **Data Policy** | Synthetic fixtures | Synthetic test catalog | Anonymized production-like data | Strictly live customer data with backups |

## Isolation Guarantees
1. **Zero Shared Infrastructure**: Production and non-production environments never share database clusters, Redis instances, or storage buckets.
2. **Credential Separation**: JWT signing keys, payment credentials (Stripe live vs test keys), and SMTP relays are independently generated.
3. **Network Segregation**: Dev and Staging instances run in isolated subnetworks with no lateral access to the production VPS.
4. **Access Control**: Developers do not possess interactive SSH keys or write credentials to the production database.

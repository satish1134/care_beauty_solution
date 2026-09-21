# Care Beauty Solution - Infrastructure Architecture Specification

## 1. Executive Summary & Philosophy
Care Beauty Solution employs an **Infrastructure-First Development** model. Customer-facing application logic builds upon an enterprise-ready, hardened, observable, and reproducible VPS foundation.
The architecture is purposefully containerized and cloud-agnostic, enabling seamless zero-code-change migration to AWS/Azure/GCP/Kubernetes in subsequent growth phases.

```
+-------------------------------------------------------------------------------+
|                            CLOUDFLARE EDGE / WAF                              |
|           DDoS Mitigation - WAF Rules - SSL Termination - CDN Caching          |
|    carebeautysolution.com | api.* | admin.* | staging.* | dev.* | monitoring.*|
+---------------------------------------+---------------------------------------+
                                        | (HTTPS / Restricted Ports 80, 443)
                                        v
+-------------------------------------------------------------------------------+
|                          VPS HOST (Hardened Ubuntu LTS)                       |
|   UFW Firewall (Deny Inbound, Allow 80/443, Rate-Limited SSH) | Fail2ban      |
+-------------------------------------------------------------------------------+
|                                                                               |
|  +-------------------------------------------------------------------------+  |
|  |                REVERSE PROXY (Nginx in Docker container)                |  |
|  | - TLS Termination / Auto Let's Encrypt renewal                           |  |
|  | - Security Headers (HSTS, CSP, X-Frame-Options)                         |  |
|  | - Route Rate Limiting (login, checkout, search)                         |  |
|  | - Maintenance Mode switch & Static Cache                                |  |
|  +--------------------+----------------------------+-----------------------+  |
|                       |                            |                          |
|                       v (Private Docker Network)   v (Private Docker Network) |
|  +-----------------------------+          +-----------------------------+     |
|  |  APP CONTAINER: ACTIVE      |          |  APP CONTAINER: STANDBY     |     |
|  |  (Next.js Standalone/Node)  |          |  (Blue/Green Idle Slot)     |     |
|  |  Port: 3001                 |          |  Port: 3002                 |     |
|  +--------------+--------------+          +-----------------------------+     |
|                 |                                                             |
|                 +-----------------------+--------------------+                |
|                                         |                    |                |
|                                         v                    v                |
|                        +-----------------------+ +-----------------------+    |
|                        |      POSTGRESQL       | |         REDIS         |    |
|                        | - Private Docker Net  | | - Private Docker Net  |    |
|                        | - Persistent Volumes  | | - Auth protected      |    |
|                        | - Automated Backups   | | - Cache, Queues, Rate |    |
|                        +-----------------------+ +-----------------------+    |
|                                         ^                                     |
|                                         | (Async job processing)              |
|                        +----------------+------------------------+            |
|                        |            BACKGROUND WORKER            |            |
|                        | - BullMQ queue processor                |            |
|                        | - Order confirmation, emails, alerts    |            |
|                        +-----------------------------------------+            |
|                                                                               |
|  +-------------------------------------------------------------------------+  |
|  |                   OBSERVABILITY & METRICS STACK                         |  |
|  | - Prometheus (Scraping system, app, DB, Redis)                          |  |
|  | - Grafana (Dashboards for Infra, App, DB, Redis, Business, Security)   |  |
|  | - Loki & Promtail (Structured JSON log aggregation)                     |  |
|  | - Node Exporter, Postgres Exporter, Redis Exporter                     |  |
|  +-------------------------------------------------------------------------+  |
+-------------------------------------------------------------------------------+
```

## 2. Component Directory
1. **Edge / CDN**: Cloudflare manages DNS, DDoS mitigation, web application firewall (WAF), edge caching, and strict SSL to origin.
2. **Reverse Proxy (Nginx)**: Runs in Docker with isolated networking. Exposes only 80 and 443. Manages path routing, rate limiting, and blue/green upstream switching.
3. **Application Container**: Multi-stage lightweight Alpine container running Next.js in standalone server mode under a non-root `nextjs` system user.
4. **Background Worker**: Node-based asynchronous queue worker processing high-latency operations (emails, webhooks, inventory sync, PDF invoices).
5. **Database (PostgreSQL 16)**: Encapsulated within a private Docker network. Configured with connection limits, slow query logging, automated snapshots, and WAL archiving.
6. **In-Memory Cache (Redis 7)**: Password-authenticated, isolated from internet access. Serves caching, session states, and BullMQ task queues.
7. **Object Storage**: S3-compatible API (MinIO for local dev, Cloudflare R2 / AWS S3 for production) delivering product media via CDN without touching VPS disk.
8. **Telemetry Core**: Prometheus, Grafana, Loki, and Promtail collecting metrics, traces, and structured JSON logs.

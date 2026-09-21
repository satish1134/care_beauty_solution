# Observability & Monitoring Specification

## 1. Stack Architecture
Care Beauty Solution employs a unified telemetry pipeline based on open standards:
- **Metrics**: Prometheus scraping every 15 seconds.
- **Log Aggregation**: Loki with Promtail collecting structured JSON container logs.
- **Visualization**: Grafana with pre-provisioned dashboards.
- **Application Tracing**: OpenTelemetry instrumentation with W3C trace context.
- **Error Tracking**: Sentry capturing unhandled exceptions and performance breadcrumbs.
- **External Uptime**: Independent multi-region uptime monitor polling `/api/health` every 60 seconds.

## 2. Metric Categories

### System Metrics (Node Exporter)
- CPU Utilization & Load Average (1m, 5m, 15m)
- RAM Usage, Available Buffers, and Swap Activity
- Disk Space Utilization and Disk I/O Wait Percentage
- Network Ingress/Egress Throughput and TCP Connection States

### Application Metrics (`/api/metrics`)
- HTTP Request Rate (RPS by route, method, status code)
- Latency Percentiles (p50, p95, p99)
- Active Database Connection Pool Utilization
- Redis Cache Hit/Miss Ratio and Memory Consumption
- BullMQ Worker Queue Depth and Processing Duration

### Business & Conversion Metrics
- Orders Created per Minute & Revenue Run-Rate
- Checkout Conversion Rate & Cart Abandonment Index
- Payment Success vs Failure Ratios (categorized by issuer code)
- Waitlist / Newsletter Signups per Hour

## 3. Alerting Thresholds & Routing

| Severity | Condition | Notification Channel | Response SLA |
|---|---|---|---|
| **CRITICAL** | Website unreachable, 5xx rate > 5% for 2m, Database down, Disk > 90% | PagerDuty / Telegram / SMS | Immediate (< 15 mins) |
| **HIGH** | Latency p95 > 2s for 5m, Redis memory > 85%, Queue backlog > 500 items | Slack #alerts-high / Email | < 1 hour |
| **MEDIUM** | Disk > 80%, CPU > 75% for 15m, Cache hit ratio < 60% | Slack #alerts-ops | Next business window |

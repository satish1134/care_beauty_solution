# Secrets Management & Key Rotation Specification

## 1. Zero-Secrets-in-Code Policy
- Secrets are NEVER stored in Git repositories, commit logs, Docker images, or client bundles.
- All secrets are injected into running containers via environment variables sourced from:
  - **Local**: Uncommitted `.env.local`
  - **CI/CD**: Encrypted GitHub Actions Environment Secrets (`dev`, `staging`, `prod`)
  - **Production Host**: Protected server-side secret file (`/opt/care-beauty/secrets/.env.prod`) accessible solely by `deploy` (chmod 600)

## 2. Inventory of Classified Secrets
| Secret Identifier | Description | Rotation Interval | Impact of Leak |
|---|---|---|---|
| `DATABASE_URL` | PostgreSQL credentials | 90 Days | Full database read/write breach |
| `REDIS_PASSWORD` | Redis authentication token | 90 Days | Cache tampering, queue hijacking |
| `JWT_SECRET` | Authentication token signing key | 180 Days | Forged user/admin sessions |
| `SESSION_SECRET` | Cookie session encryptor | 180 Days | Session impersonation |
| `PAYMENT_SECRET_KEY` | Stripe / Payment gateway secret | 90 Days | Unauthorized refund/charge attempts |
| `PAYMENT_WEBHOOK_SECRET` | Webhook signature verification | 180 Days | Spoofed payment success signals |
| `S3_SECRET_ACCESS_KEY` | Object storage credentials | 90 Days | Asset bucket unauthorized access |
| `VPS_SSH_KEY` | Deploy user private key | 90 Days | VPS code deployment capability |

## 3. Standard Rotation Procedure
1. **Prepare New Secret**: Generate high-entropy secret using `openssl rand -base64 32`.
2. **Dual-Acceptance Window**: For JWT and encryption keys, support dual-key verification during a 24-hour overlap window.
3. **Update Vault/GitHub Secrets**: Update corresponding GitHub Environment Secrets.
4. **Deploy Application**: Trigger standard zero-downtime blue/green deployment to inject updated variables into standby container.
5. **Revoke Old Secret**: Invalidate prior key on third-party provider dashboard or database user account.

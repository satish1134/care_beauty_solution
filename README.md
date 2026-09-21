# CARE-A Beauty Solution

Pre-launch landing page and email waitlist for CARE-A Beauty Solution.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The waitlist form posts to `/api/subscribe` and stores local development subscribers in `data/waitlist.json`. That file is ignored by Git. Use a managed database or email platform before production deployment.

## Deployment

- `main` deploys production at `careabeautysolution.com`.
- `develop` deploys internal testing at `dev.careabeautysolution.com`.
- Production uses VPS port `3001`; development uses VPS port `3002`.

## GitHub CLI deployment flow

Install GitHub CLI, then authenticate locally:

```powershell
gh auth login
gh auth status
```

GitHub Actions reads deployment secrets; local code never reads their values. Configure these secrets in both GitHub environments (`prod` and `dev`): `VPS_HOST`, `VPS_PORT`, `VPS_USER`, `VPS_SSH_KEY`, `GHCR_USER`, and `GHCR_READ_TOKEN`.

Push normally from the local workspace:

```powershell
git push origin develop  # deploys dev
git push origin main     # deploys production
```

Or trigger a deployment manually from the local terminal:

```powershell
gh workflow run deploy.yml --ref develop -f branch=develop
gh workflow run deploy.yml --ref main -f branch=main
gh run watch
```

List configured secret names without revealing values:

```powershell
gh secret list --env dev
gh secret list --env prod
```

GitHub CLI cannot read secret values by design. Use the GitHub Actions runner to consume them securely.

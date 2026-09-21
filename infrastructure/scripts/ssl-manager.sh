#!/usr/bin/env bash
# ==============================================================================
# Care Beauty Solution - SSL Certificate Audit & Provisioning Script
# Manages Let's Encrypt certificates across storefront, dev, and admin domains
# ==============================================================================
set -euo pipefail

DOMAINS=(
  "careabeautysolution.com"
  "www.careabeautysolution.com"
  "dev.careabeautysolution.com"
  "admin.careabeautysolution.com"
)

ACTION="${1:-status}"
EMAIL="${2:-info@careabeautysolution.com}"

echo "========================================================"
echo "Care Beauty Solution - SSL Certificate Manager"
echo "Action: ${ACTION}"
echo "========================================================"

case "${ACTION}" in
  status)
    echo "==> [1/2] Checking Certbot Installed Certificates..."
    if command -v certbot &>/dev/null; then
      certbot certificates || true
    else
      echo "Notice: certbot CLI not found on host path."
    fi

    echo ""
    echo "==> [2/2] Checking /etc/letsencrypt/live Directory..."
    if [ -d "/etc/letsencrypt/live" ]; then
      ls -la /etc/letsencrypt/live/
    else
      echo "Directory /etc/letsencrypt/live does not exist."
    fi
    ;;

  issue-admin)
    echo "==> Requesting SSL certificate for admin domains..."
    mkdir -p /var/www/certbot
    
    # Try webroot challenge first (Nginx already routes /.well-known/acme-challenge/)
    certbot certonly --webroot \
      -w /var/www/certbot \
      -d admin.careabeautysolution.com \
      --email "${EMAIL}" \
      --agree-tos \
      --non-interactive \
      --keep-until-expiring || \
    certbot certonly --nginx \
      -d admin.careabeautysolution.com \
      --email "${EMAIL}" \
      --agree-tos \
      --non-interactive \
      --keep-until-expiring

    # Ensure compatibility symlinks exist for Nginx
    mkdir -p /etc/letsencrypt/live
    if [ -d "/etc/letsencrypt/live/admin.careabeautysolution.com" ] && [ ! -e "/etc/letsencrypt/live/admin.carebeautysolution.com" ]; then
      ln -s "/etc/letsencrypt/live/admin.careabeautysolution.com" "/etc/letsencrypt/live/admin.carebeautysolution.com" || true
    fi

    echo "==> Reloading Nginx..."
    if [ -x "$(command -v systemctl)" ] && systemctl is-active --quiet nginx; then
      systemctl reload nginx
    elif docker ps --format '{{.Names}}' | grep -q "^care_nginx_prod$"; then
      docker exec care_nginx_prod nginx -s reload
    fi
    echo "==> Admin SSL provisioned and Nginx reloaded successfully!"
    ;;

  issue-unified)
    echo "==> Requesting unified multi-domain SAN SSL certificate for all domains..."
    mkdir -p /var/www/certbot
    
    DOMAIN_ARGS=""
    for d in "${DOMAINS[@]}"; do
      DOMAIN_ARGS="${DOMAIN_ARGS} -d ${d}"
    done

    certbot certonly --webroot \
      -w /var/www/certbot \
      ${DOMAIN_ARGS} \
      --email "${EMAIL}" \
      --agree-tos \
      --non-interactive \
      --expand || \
    certbot certonly --nginx \
      ${DOMAIN_ARGS} \
      --email "${EMAIL}" \
      --agree-tos \
      --non-interactive \
      --expand

    # Ensure compatibility symlinks exist for Nginx
    mkdir -p /etc/letsencrypt/live
    if [ -d "/etc/letsencrypt/live/careabeautysolution.com" ]; then
      [ ! -e "/etc/letsencrypt/live/carebeautysolution.com" ] && ln -s "/etc/letsencrypt/live/careabeautysolution.com" "/etc/letsencrypt/live/carebeautysolution.com" || true
      [ ! -e "/etc/letsencrypt/live/admin.carebeautysolution.com" ] && ln -s "/etc/letsencrypt/live/careabeautysolution.com" "/etc/letsencrypt/live/admin.carebeautysolution.com" || true
      [ ! -e "/etc/letsencrypt/live/admin.careabeautysolution.com" ] && ln -s "/etc/letsencrypt/live/careabeautysolution.com" "/etc/letsencrypt/live/admin.careabeautysolution.com" || true
      [ ! -e "/etc/letsencrypt/live/dev.carebeautysolution.com" ] && ln -s "/etc/letsencrypt/live/careabeautysolution.com" "/etc/letsencrypt/live/dev.carebeautysolution.com" || true
    fi

    echo "==> Reloading Nginx..."
    if [ -x "$(command -v systemctl)" ] && systemctl is-active --quiet nginx; then
      systemctl reload nginx
    elif docker ps --format '{{.Names}}' | grep -q "^care_nginx_prod$"; then
      docker exec care_nginx_prod nginx -s reload
    fi
    echo "==> Unified SAN SSL provisioned and Nginx reloaded successfully!"
    ;;

  reload)
    echo "==> Reloading Nginx..."
    if [ -x "$(command -v systemctl)" ] && systemctl is-active --quiet nginx; then
      systemctl reload nginx
      echo "Host Nginx reloaded."
    elif docker ps --format '{{.Names}}' | grep -q "^care_nginx_prod$"; then
      docker exec care_nginx_prod nginx -s reload
      echo "Docker care_nginx_prod reloaded."
    fi
    ;;

  *)
    echo "Unknown action: ${ACTION}"
    echo "Available actions: status, issue-admin, issue-unified, reload"
    exit 1
    ;;
esac

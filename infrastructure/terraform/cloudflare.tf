# Cloudflare DNS Records & Proxied Edge Configuration
resource "cloudflare_record" "apex" {
  count   = var.cloudflare_zone_id != "" ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = "@"
  value   = var.prod_vps_ip
  type    = "A"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "www" {
  count   = var.cloudflare_zone_id != "" ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = "www"
  value   = var.prod_vps_ip
  type    = "A"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "api" {
  count   = var.cloudflare_zone_id != "" ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = "api"
  value   = var.prod_vps_ip
  type    = "A"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "admin" {
  count   = var.cloudflare_zone_id != "" ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = "admin"
  value   = var.prod_vps_ip
  type    = "A"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "staging" {
  count   = var.cloudflare_zone_id != "" ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = "staging"
  value   = var.prod_vps_ip
  type    = "A"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "dev" {
  count   = var.cloudflare_zone_id != "" ? 1 : 0
  zone_id = var.cloudflare_zone_id
  name    = "dev"
  value   = var.dev_vps_ip
  type    = "A"
  proxied = true
  ttl     = 1
}

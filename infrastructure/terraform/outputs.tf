output "production_url" {
  description = "Production HTTPS endpoint"
  value       = "https://${var.domain_name}"
}

output "development_url" {
  description = "Development HTTPS endpoint"
  value       = "https://dev.${var.domain_name}"
}

output "staging_url" {
  description = "Staging HTTPS endpoint"
  value       = "https://staging.${var.domain_name}"
}

output "monitoring_url" {
  description = "Restricted Monitoring Ingress"
  value       = "https://monitoring.${var.domain_name}"
}

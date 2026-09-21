variable "cloudflare_api_token" {
  description = "Cloudflare API token for DNS & WAF automation"
  type        = string
  sensitive   = true
  default     = ""
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for carebeautysolution.com"
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Apex domain name"
  type        = string
  default     = "carebeautysolution.com"
}

variable "prod_vps_ip" {
  description = "IPv4 address of the production VPS host"
  type        = string
  default     = "198.51.100.10"
}

variable "dev_vps_ip" {
  description = "IPv4 address of the development VPS host"
  type        = string
  default     = "198.51.100.20"
}

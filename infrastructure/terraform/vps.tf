# VPS Provisioning Resource Template (Hetzner / DigitalOcean / Linode)
# Demonstrates portable cloud-init specification for repeatable VPS provisioning

resource "local_file" "cloud_init_production" {
  filename = "${path.module}/cloud-init-prod.yaml"
  content  = <<-EOF
    #cloud-config
    users:
      - name: deploy
        groups: sudo, docker
        shell: /bin/bash
        sudo: ['ALL=(ALL) NOPASSWD:ALL']
        ssh_authorized_keys:
          - "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICareBeautyDeployMasterKey care-deploy"

    package_update: true
    package_upgrade: true
    packages:
      - curl
      - ufw
      - fail2ban
      - unattended-upgrades
      - git

    runcmd:
      - curl -fsSL https://get.docker.com | sh
      - ufw default deny incoming
      - ufw default allow outgoing
      - ufw allow 80/tcp
      - ufw allow 443/tcp
      - ufw limit 22/tcp
      - ufw --force enable
  EOF
}

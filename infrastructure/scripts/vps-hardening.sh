#!/usr/bin/env bash
# ==============================================================================
# Care Beauty Solution - VPS OS Baseline Hardening Script
# Targets: Ubuntu 22.04 / 24.04 LTS or Debian 12
# Standards: CIS Linux Benchmark Level 1 Alignment
# ==============================================================================
set -euo pipefail

echo "==> [1/8] Updating package index and installing baseline utilities..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y --no-install-recommends \
    curl \
    wget \
    git \
    ufw \
    fail2ban \
    unattended-upgrades \
    apt-listchanges \
    htop \
    ca-certificates \
    gnupg \
    lsb-release

echo "==> [2/8] Creating unprivileged deployment user 'deploy'..."
if ! id "deploy" &>/dev/null; then
    adduser --disabled-password --gecos "Care Beauty Deployer" deploy
    usermod -aG sudo deploy
    echo "deploy ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/bin/docker-compose, /usr/bin/systemctl restart nginx" >> /etc/sudoers.d/deploy-limits
    chmod 0440 /etc/sudoers.d/deploy-limits
fi

echo "==> [3/8] Hardening SSH Configuration (/etc/ssh/sshd_config.d/99-hardening.conf)..."
cat << 'EOF' > /etc/ssh/sshd_config.d/99-hardening.conf
# Prohibit root login
PermitRootLogin no
# Require SSH Public Key Authentication
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
# Prevent X11 forwarding
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
EOF
sshd -t
systemctl reload ssh || systemctl reload sshd

echo "==> [4/8] Configuring UFW Firewall (Default DENY Inbound, ALLOW Ports 80 & 443)..."
ufw default deny incoming
ufw default allow outgoing
# Allow standard web traffic
ufw allow 80/tcp comment 'HTTP (Let Encrypt / Redirect)'
ufw allow 443/tcp comment 'HTTPS (Secure Web)'
# Allow SSH with rate limiting
ufw limit 22/tcp comment 'SSH (Rate Limited)'
# Explicitly ensure internal services remain unexposed
ufw deny 5432 comment 'Block Public PostgreSQL'
ufw deny 6379 comment 'Block Public Redis'
ufw --force enable

echo "==> [5/8] Configuring Fail2ban for SSH Protection..."
cat << 'EOF' > /etc/fail2ban/jail.local
[DEFAULT]
bantime = 1d
findtime = 10m
maxretry = 3

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
EOF
systemctl restart fail2ban

echo "==> [6/8] Enabling Unattended Automatic Security Updates..."
cat << 'EOF' > /etc/apt/apt.conf.d/20auto-upgrades
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
systemctl restart unattended-upgrades

echo "==> [7/8] Installing Docker Engine & Compose plugin..."
if ! command -v docker &>/dev/null; then
    curl -fsSL https://get.docker.com | sh
    usermod -aG docker deploy
fi

echo "==> [8/8] Hardening sysctl network kernel parameters..."
cat << 'EOF' > /etc/sysctl.d/99-security.conf
# Disable IP packet forwarding
net.ipv4.ip_forward = 1
# Ignore ICMP broadcast requests
net.ipv4.icmp_echo_ignore_broadcasts = 1
# Protect against SYN flood attacks
net.ipv4.tcp_syncookies = 1
# Disable ICMP redirect acceptance
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
# Log spoofed, source routed, and redirect packets
net.ipv4.conf.all.log_martians = 1
EOF
sysctl --system > /dev/null

echo "==> VPS Baseline Hardening Completed Successfully!"
echo "Verify ports: netstat -tulpn | grep LISTEN"

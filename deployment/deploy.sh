#!/bin/bash
set -e

# =============================================================================
# PetWebsite Deployment Script for Ubuntu 24.04 LTS
# =============================================================================
# This script installs and configures:
# - PostgreSQL 16
# - .NET 8 SDK
# - Node.js 20 LTS + Yarn
# - Nginx (Reverse Proxy)
# - Backend API (systemd service) — serves API + admin panel SPA
# - Certbot (Let's Encrypt SSL for puppy-api.cloud)
#
# Frontend (Next.js) is hosted on Vercel at puppy.az
# =============================================================================

echo "=========================================="
echo "PetWebsite Deployment Script"
echo "=========================================="

# Configuration
DOMAIN="puppy-api.cloud"
DB_NAME="PetWebsiteDb"
DB_USER="petwebsite_user"
DB_PASS="PetWeb_Pr0d_X9k#2026!vPs"
APP_DIR="/var/www/petwebsite"
BACKEND_DIR="$APP_DIR/back-api"
ADMIN_DIR="$APP_DIR/admin-panel"

# =============================================================================
# 1. System Update
# =============================================================================
echo ""
echo "[1/10] Updating system packages..."
apt update && apt upgrade -y

# =============================================================================
# 2. Install PostgreSQL 16
# =============================================================================
echo ""
echo "[2/10] Installing PostgreSQL 16..."
apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Configure PostgreSQL
echo "Configuring PostgreSQL database and user..."
sudo -u postgres psql <<EOF
-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
    ELSE
        ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';
    END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE "$DB_NAME" OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE "$DB_NAME" TO $DB_USER;

-- Connect to database and grant schema privileges
\c "$DB_NAME"
GRANT ALL ON SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO $DB_USER;
EOF

echo "PostgreSQL configured successfully!"

# =============================================================================
# 3. Install .NET 8 SDK
# =============================================================================
echo ""
echo "[3/10] Installing .NET 8 SDK..."

# Add Microsoft package repository
wget https://packages.microsoft.com/config/ubuntu/24.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

apt update
apt install -y dotnet-sdk-8.0

echo ".NET SDK installed: $(dotnet --version)"

# =============================================================================
# 4. Install Node.js 20 LTS + Yarn
# =============================================================================
echo ""
echo "[4/10] Installing Node.js 20 LTS and Yarn..."

# Install Node.js from NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Yarn
npm install -g yarn

echo "Node.js installed: $(node --version)"
echo "npm installed: $(npm --version)"
echo "Yarn installed: $(yarn --version)"

# =============================================================================
# 5. Install Nginx + Certbot
# =============================================================================
echo ""
echo "[5/10] Installing Nginx and Certbot..."
apt install -y nginx certbot python3-certbot-nginx

systemctl start nginx
systemctl enable nginx

echo "Nginx installed: $(nginx -v 2>&1)"

# =============================================================================
# 6. Build Admin Panel
# =============================================================================
echo ""
echo "[6/10] Building Admin Panel..."

cd "$ADMIN_DIR"
yarn install --frozen-lockfile
yarn build

# Copy admin panel build output to backend wwwroot
mkdir -p "$BACKEND_DIR/src/PetWebsite.API/wwwroot/admin"
rm -rf "$BACKEND_DIR/src/PetWebsite.API/wwwroot/admin/"*
cp -r "$ADMIN_DIR/dist/"* "$BACKEND_DIR/src/PetWebsite.API/wwwroot/admin/"

echo "Admin panel built and copied to backend wwwroot!"

# =============================================================================
# 7. Build Backend API
# =============================================================================
echo ""
echo "[7/10] Building Backend API..."

cd "$BACKEND_DIR/src/PetWebsite.API"

# Restore and publish
dotnet restore
dotnet publish -c Release -o "$BACKEND_DIR/publish"

# Create uploads directory and set permissions
mkdir -p "$BACKEND_DIR/publish/wwwroot/uploads"
chmod -R 755 "$BACKEND_DIR/publish/wwwroot"
chown -R www-data:www-data "$BACKEND_DIR/publish/wwwroot"

# Copy seed data if exists
if [ -d "$BACKEND_DIR/src/PetWebsite.API/wwwroot" ]; then
    cp -r "$BACKEND_DIR/src/PetWebsite.API/wwwroot/"* "$BACKEND_DIR/publish/wwwroot/" 2>/dev/null || true
fi

echo "Backend built successfully!"

# =============================================================================
# 8. Create Backend systemd Service
# =============================================================================
echo ""
echo "[8/10] Creating Backend systemd service..."

cat > /etc/systemd/system/petwebsite-api.service <<EOF
[Unit]
Description=PetWebsite API
After=network.target postgresql.service

[Service]
WorkingDirectory=$BACKEND_DIR/publish
ExecStart=/usr/bin/dotnet $BACKEND_DIR/publish/PetWebsite.API.dll
Restart=always
RestartSec=10
SyslogIdentifier=petwebsite-api
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://localhost:5005
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target
EOF

# Set ownership for the backend
chown -R www-data:www-data "$BACKEND_DIR"

# Reload systemd and start service
systemctl daemon-reload
systemctl enable petwebsite-api
systemctl start petwebsite-api

echo "Backend service created and started!"

# =============================================================================
# 9. Configure Nginx
# =============================================================================
echo ""
echo "[9/10] Configuring Nginx..."

# Remove default config
rm -f /etc/nginx/sites-enabled/default

# Create PetWebsite Nginx config
cat > /etc/nginx/sites-available/petwebsite <<'NGINXEOF'
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

upstream backend {
    server 127.0.0.1:5005;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name puppy-api.cloud;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript application/json image/svg+xml;
    gzip_disable "MSIE [1-6]\.";

    # Client max body size (for file uploads)
    client_max_body_size 15M;

    # Admin panel static assets (aggressive cache)
    location /admin/assets/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Static uploads from backend
    location /uploads/ {
        proxy_pass http://backend/uploads/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        add_header Cache-Control "public, max-age=31536000";
    }

    # SignalR hub (WebSocket support)
    location /hubs/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://backend/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # All other requests (API + admin SPA fallback)
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90s;
        proxy_connect_timeout 90s;
        proxy_send_timeout 90s;
    }
}
NGINXEOF

# Enable the site
ln -sf /etc/nginx/sites-available/petwebsite /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx

echo "Nginx configured and reloaded!"

# =============================================================================
# 10. SSL Certificate (Let's Encrypt)
# =============================================================================
echo ""
echo "[10/10] Obtaining SSL certificate..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@puppy.az --redirect || {
    echo "WARNING: Certbot failed. You can run it manually later:"
    echo "  certbot --nginx -d $DOMAIN"
}

# =============================================================================
# Import Database Backup (if exists)
# =============================================================================
if [ -f "$BACKEND_DIR/backup_PetWebsiteDb.sql" ]; then
    echo ""
    echo "Importing database backup..."
    
    # Remove the \restrict line from backup file (it's a custom marker)
    sed -i '/^\\restrict/d' "$BACKEND_DIR/backup_PetWebsiteDb.sql"
    
    # Import the backup
    sudo -u postgres psql -d "$DB_NAME" -f "$BACKEND_DIR/backup_PetWebsiteDb.sql" 2>/dev/null || true
    
    # Grant table permissions to user
    sudo -u postgres psql -d "$DB_NAME" <<EOF
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $DB_USER;
EOF
    
    echo "Database backup imported!"
fi

# =============================================================================
# Final Status
# =============================================================================
echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Services Status:"
echo "----------------"
systemctl status petwebsite-api --no-pager -l | head -5
echo ""
systemctl status nginx --no-pager -l | head -5
echo ""
echo "=========================================="
echo "Access your application at:"
echo "  API:         https://$DOMAIN/api"
echo "  Admin Panel: https://$DOMAIN/admin"
echo "  Health:      https://$DOMAIN/health"
echo "  Frontend:    https://puppy.az (Vercel)"
echo "=========================================="
echo ""
echo "Useful commands:"
echo "  - View API logs:    journalctl -u petwebsite-api -f"
echo "  - Restart API:      systemctl restart petwebsite-api"
echo "  - Nginx logs:       tail -f /var/log/nginx/error.log"
echo "  - Renew SSL:        certbot renew --dry-run"
echo ""
echo "Database credentials:"
echo "  Database: $DB_NAME"
echo "  User:     $DB_USER"
echo "  Password: $DB_PASS"
echo ""

#!/bin/bash
# =============================================================================
# Grant Permissions Script
# Fixes database and file system permissions for PetWebsite
# =============================================================================

echo "=== Granting PostgreSQL Permissions ==="
sudo -u postgres psql -d PetWebsiteDb << 'EOF'
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO petwebsite_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO petwebsite_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO petwebsite_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO petwebsite_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO petwebsite_user;
EOF

echo ""
echo "=== Fixing wwwroot File Permissions ==="
BACKEND_DIR="/var/www/petwebsite/back-api"

# Fix ownership for uploads directory
chown -R www-data:www-data "$BACKEND_DIR/publish/wwwroot"
chmod -R 755 "$BACKEND_DIR/publish/wwwroot"

# Ensure uploads subdirectories exist with correct permissions
mkdir -p "$BACKEND_DIR/publish/wwwroot/uploads/pet-ads"
mkdir -p "$BACKEND_DIR/publish/wwwroot/uploads/profile-pictures"
mkdir -p "$BACKEND_DIR/publish/wwwroot/uploads/videos"
chown -R www-data:www-data "$BACKEND_DIR/publish/wwwroot/uploads"

echo ""
echo "=== Permissions Fixed Successfully ==="

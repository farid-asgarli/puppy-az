#!/bin/bash
set -e

# =============================================================================
# Quick Update Script - Pulls latest code and restarts services
# Run this on the server for quick deployments
# =============================================================================

echo "=========================================="
echo "Quick Update Script - $(date)"
echo "=========================================="

APP_DIR="/var/www/petwebsite"
BACKEND_DIR="$APP_DIR/back-api"
ADMIN_DIR="$APP_DIR/admin-panel"

# Navigate to app directory
cd $APP_DIR

# Pull latest changes
echo "[1/7] Pulling latest changes from GitHub..."
git fetch origin main
git reset --hard origin/main

# Stop Backend before rebuild
echo "[2/7] Stopping Backend service..."
sudo systemctl stop petwebsite-api

# Build Admin Panel
echo "[3/7] Building Admin Panel..."
cd "$ADMIN_DIR"
yarn install --frozen-lockfile
yarn build

# Copy admin panel build to backend wwwroot
echo "[4/7] Deploying Admin Panel to backend..."
mkdir -p "$BACKEND_DIR/src/PetWebsite.API/wwwroot/admin"
rm -rf "$BACKEND_DIR/src/PetWebsite.API/wwwroot/admin/"*
cp -r "$ADMIN_DIR/dist/"* "$BACKEND_DIR/src/PetWebsite.API/wwwroot/admin/"

# Build Backend
echo "[5/7] Building Backend API..."
cd "$BACKEND_DIR/src/PetWebsite.API"
dotnet restore
dotnet publish -c Release -o "$BACKEND_DIR/publish" --no-restore

# Copy wwwroot content (preserving uploads)
echo "[6/7] Updating static files..."
if [ -d "$BACKEND_DIR/src/PetWebsite.API/wwwroot" ]; then
    rsync -av --exclude='uploads' "$BACKEND_DIR/src/PetWebsite.API/wwwroot/" "$BACKEND_DIR/publish/wwwroot/"
fi

# Fix ownership for www-data (important for file uploads)
chown -R www-data:www-data "$BACKEND_DIR/publish/wwwroot"
chmod -R 755 "$BACKEND_DIR/publish/wwwroot"

# Restart Backend
echo "[7/7] Starting Backend service..."
sudo systemctl start petwebsite-api

echo "=========================================="
echo "Update completed successfully!"
echo "Finished at: $(date)"
echo "=========================================="

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
FRONTEND_DIR="$APP_DIR/front-public"

# Navigate to app directory
cd $APP_DIR

# Pull latest changes
echo "[1/6] Pulling latest changes from GitHub..."
git fetch origin main
git reset --hard origin/main

# Build Backend
echo "[2/6] Building Backend API..."
cd "$BACKEND_DIR/src/PetWebsite.API"
dotnet restore
dotnet publish -c Release -o "$BACKEND_DIR/publish" --no-restore

# Copy wwwroot content (preserving uploads)
echo "[3/6] Updating static files..."
if [ -d "$BACKEND_DIR/src/PetWebsite.API/wwwroot" ]; then
    rsync -av --exclude='uploads' "$BACKEND_DIR/src/PetWebsite.API/wwwroot/" "$BACKEND_DIR/publish/wwwroot/"
fi

# Restart Backend
echo "[4/6] Restarting Backend service..."
sudo systemctl restart petwebsite-api

# Build Frontend
echo "[5/6] Building Frontend..."
cd "$FRONTEND_DIR"
npm ci --production=false
npm run build

# Restart Frontend
echo "[6/6] Restarting Frontend..."
pm2 restart petwebsite-frontend || pm2 start npm --name "petwebsite-frontend" -- start -- -p 3000
pm2 save

echo "=========================================="
echo "Update completed successfully!"
echo "Finished at: $(date)"
echo "=========================================="

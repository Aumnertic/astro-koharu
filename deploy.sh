#!/usr/bin/env bash
# =============================================================================
# astro-koharu — build & deploy to host nginx
# Serves static dist/ at aumnertic.top + blog.aumnertic.top
# =============================================================================
# Usage:
#   ./deploy.sh            # build + publish to /var/www/aumnertic + reload nginx
#   ./deploy.sh --skip-build   # just re-publish existing dist/ and reload
# =============================================================================
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

WEBROOT="/var/www/aumnertic"

if [[ "${1:-}" != "--skip-build" ]]; then
  echo "🔨 Building (4GB node heap; swap required on low-RAM hosts)..."
  export NODE_OPTIONS="--max-old-space-size=4096"
  corepack pnpm build
fi

if [[ ! -f dist/index.html ]]; then
  echo "❌ dist/index.html missing — build failed or was skipped without a prior build."
  exit 1
fi

echo "🚚 Publishing dist/ → $WEBROOT ..."
mkdir -p "$WEBROOT"
rsync -a --delete dist/ "$WEBROOT/"
chown -R www-data:www-data "$WEBROOT"
chmod -R a+rX "$WEBROOT"

echo "🔁 Reloading nginx..."
nginx -t
nginx -s reload

echo "✅ Deployed. https://blog.aumnertic.top  /  https://aumnertic.top"

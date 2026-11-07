#!/usr/bin/env bash
set -euo pipefail

echo "Setting up Nepal CEE Platform development environment..."

# 1. Environment files copy if not exist
if [ ! -f "apps/web/.env.local" ]; then
    cp apps/web/.env.example apps/web/.env.local
    echo "Created apps/web/.env.local from example template."
fi

if [ ! -f "apps/api/.env" ]; then
    cp apps/api/.env.example apps/api/.env
    echo "Created apps/api/.env from example template."
fi

# 2. Install pnpm dependencies
echo "Installing Node.js monorepo workspace dependencies via pnpm..."
pnpm install

# 3. Setup Python virtual environment
echo "Setting up Python virtual environment in apps/api/.venv..."
if [ ! -d "apps/api/.venv" ]; then
    python3 -m venv apps/api/.venv
fi

apps/api/.venv/bin/python -m pip install --upgrade pip
apps/api/.venv/bin/pip install -r apps/api/requirements/dev.txt

echo "Development environment setup complete!"
echo "To run the Next.js frontend: pnpm dev:web"
echo "To run Django backend: apps/api/.venv/bin/python apps/api/manage.py runserver"


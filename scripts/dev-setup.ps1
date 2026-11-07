# PowerShell Development Environment Setup Script
$ErrorActionPreference = "Stop"

Write-Host "Setting up Nepal CEE Platform development environment..." -ForegroundColor Cyan

# 1. Environment files copy if not exist
if (-not (Test-Path "apps/web/.env.local")) {
    Copy-Item "apps/web/.env.example" "apps/web/.env.local"
    Write-Host "Created apps/web/.env.local from example template." -ForegroundColor Green
}

if (-not (Test-Path "apps/api/.env")) {
    Copy-Item "apps/api/.env.example" "apps/api/.env"
    Write-Host "Created apps/api/.env from example template." -ForegroundColor Green
}

# 2. Install pnpm dependencies
Write-Host "Installing Node.js monorepo workspace dependencies via pnpm..." -ForegroundColor Yellow
pnpm install

# 3. Setup Python virtual environment
Write-Host "Setting up Python virtual environment in apps/api/.venv..." -ForegroundColor Yellow
if (-not (Test-Path "apps/api/.venv")) {
    python -m venv apps/api/.venv
}

& apps/api/.venv/Scripts/python.exe -m pip install --upgrade pip
& apps/api/.venv/Scripts/pip.exe install -r apps/api/requirements/dev.txt

Write-Host "Development environment setup complete!" -ForegroundColor Green
Write-Host "To run the Next.js frontend: pnpm dev:web"
Write-Host "To run Django backend: & apps/api/.venv/Scripts/python.exe apps/api/manage.py runserver"


# PowerShell Verification Script for Nepal CEE Platform (Phase 0)
$ErrorActionPreference = "Stop"

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Nepal Medical CEE Platform - Phase 0 Verification   " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# 1. Verify Contracts Package
Write-Host "`n[1/4] Verifying @cee/contracts TypeScript build..." -ForegroundColor Yellow
pnpm --filter @cee/contracts typecheck
if ($LASTEXITCODE -eq 0) {
    Write-Host "  -> @cee/contracts typecheck passed." -ForegroundColor Green
} else {
    Write-Host "  -> @cee/contracts typecheck failed!" -ForegroundColor Red
    exit 1
}

# 2. Verify Next.js Web App
Write-Host "`n[2/4] Verifying @cee/web TypeScript compilation..." -ForegroundColor Yellow
pnpm --filter @cee/web typecheck
if ($LASTEXITCODE -eq 0) {
    Write-Host "  -> @cee/web typecheck passed." -ForegroundColor Green
} else {
    Write-Host "  -> @cee/web typecheck failed!" -ForegroundColor Red
    exit 1
}

# 3. Verify Django Configuration & App Integrity
Write-Host "`n[3/4] Verifying Django configuration and system checks..." -ForegroundColor Yellow
$pythonExe = "python"
if (Test-Path "apps/api/.venv/Scripts/python.exe") {
    $pythonExe = "apps/api/.venv/Scripts/python.exe"
}

& $pythonExe apps/api/manage.py check --settings=config.settings.development
if ($LASTEXITCODE -eq 0) {
    Write-Host "  -> Django development settings check passed." -ForegroundColor Green
} else {
    Write-Host "  -> Django check failed!" -ForegroundColor Red
    exit 1
}

# 4. Run Core Backend Tests
Write-Host "`n[4/4] Running Django backend baseline tests..." -ForegroundColor Yellow
& $pythonExe apps/api/manage.py test apps.core apps.accounts apps.organizations --settings=config.settings.test
if ($LASTEXITCODE -eq 0) {
    Write-Host "  -> Django unit tests passed." -ForegroundColor Green
} else {
    Write-Host "  -> Django tests failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n======================================================" -ForegroundColor Green
Write-Host "  All Phase 0 System Verifications Passed Successfully " -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green


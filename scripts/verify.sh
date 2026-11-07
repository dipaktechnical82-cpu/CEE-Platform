#!/usr/bin/env bash
set -euo pipefail

echo "======================================================"
echo "  Nepal Medical CEE Platform - Phase 0 Verification   "
echo "======================================================"

echo ""
echo "[1/4] Verifying @cee/contracts TypeScript build..."
pnpm --filter @cee/contracts typecheck
echo "  -> @cee/contracts typecheck passed."

echo ""
echo "[2/4] Verifying @cee/web TypeScript compilation..."
pnpm --filter @cee/web typecheck
echo "  -> @cee/web typecheck passed."

echo ""
echo "[3/4] Verifying Django configuration and system checks..."
PYTHON_BIN="python3"
if [ -f "apps/api/.venv/bin/python" ]; then
    PYTHON_BIN="apps/api/.venv/bin/python"
fi

$PYTHON_BIN apps/api/manage.py check --settings=config.settings.development
echo "  -> Django development settings check passed."

echo ""
echo "[4/4] Running Django backend baseline tests..."
$PYTHON_BIN apps/api/manage.py test apps.core apps.accounts apps.organizations --settings=config.settings.test
echo "  -> Django unit tests passed."

echo ""
echo "======================================================"
echo "  All Phase 0 System Verifications Passed Successfully "
echo "======================================================"


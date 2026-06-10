# Install dependencies inside WSL (fixes broken Windows pnpm installs on \\wsl$\ paths).

$ErrorActionPreference = "Stop"

Write-Host "Installing dependencies in WSL Ubuntu..." -ForegroundColor Cyan

wsl -d Ubuntu -e bash -lc @"
set -e
cd /home/alysibak/hackd/hackcanada
rm -rf node_modules
pnpm install
echo ''
echo 'Done. Start dev with: pnpm dev  (inside Ubuntu terminal)'
echo 'Or from PowerShell: .\scripts\dev-wsl.ps1'
"@

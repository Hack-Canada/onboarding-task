# Run HackCanada dev server inside WSL (use from Windows PowerShell).
# Do NOT run pnpm directly on \\wsl$\ paths — CMD cannot use UNC paths.

$ErrorActionPreference = "Stop"

Write-Host "Starting dev server in WSL Ubuntu..." -ForegroundColor Cyan

wsl -d Ubuntu -e bash -lc @"
set -e
cd /home/alysibak/hackd/hackcanada

if ! command -v node >/dev/null 2>&1; then
  echo 'ERROR: Node.js is not installed in WSL.'
  echo 'Open an Ubuntu terminal and run:'
  echo '  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash'
  echo '  source ~/.bashrc && nvm install 20 && corepack enable && corepack prepare pnpm@latest --activate'
  exit 1
fi

if [ ! -x node_modules/.bin/astro ] 2>/dev/null; then
  echo 'Installing dependencies in WSL...'
  pnpm install
fi

exec pnpm dev
"@

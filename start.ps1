#Requires -Version 5.1
<#
.SYNOPSIS
  Levanta el frontend (Vite) y el backend (Express) de FitForge en paralelo.
.DESCRIPTION
  Usa PowerShell Jobs para correr ambos procesos en la misma terminal con
  salida intercalada y prefijos de color diferenciados.
.EXAMPLE
  .\start.ps1
  .\start.ps1 -SkipChecks    # omite verificaciones de dependencias
#>

param(
  [switch]$SkipChecks
)

# ── Helpers ──────────────────────────────────────────────────────────────────

function Write-Header {
  $c = [Console]::WindowWidth
  if ($c -lt 10) { $c = 80 }
  $line = '─' * ($c - 2)
  Write-Host ""
  Write-Host "  ███████╗██╗████████╗███████╗ ██████╗ ██████╗  ██████╗ ███████╗" -ForegroundColor Cyan
  Write-Host "  ██╔════╝██║╚══██╔══╝██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝" -ForegroundColor Cyan
  Write-Host "  █████╗  ██║   ██║   █████╗  ██║   ██║██████╔╝██║  ███╗█████╗  " -ForegroundColor Cyan
  Write-Host "  ██╔══╝  ██║   ██║   ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  " -ForegroundColor Cyan
  Write-Host "  ██║     ██║   ██║   ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗" -ForegroundColor Cyan
  Write-Host "  ╚═╝     ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "  $line" -ForegroundColor DarkGray
  Write-Host "   Frontend  →  " -NoNewline; Write-Host "http://localhost:5173" -ForegroundColor Green
  Write-Host "   Backend   →  " -NoNewline; Write-Host "http://localhost:3001" -ForegroundColor Yellow
  Write-Host "   Health    →  " -NoNewline; Write-Host "http://localhost:3001/health" -ForegroundColor DarkGray
  Write-Host "  $line" -ForegroundColor DarkGray
  Write-Host ""
}

function Write-Tag($tag, $color, $message) {
  $ts = (Get-Date).ToString("HH:mm:ss")
  Write-Host "  [$ts] " -NoNewline -ForegroundColor DarkGray
  Write-Host " $tag " -NoNewline -BackgroundColor $color -ForegroundColor Black
  Write-Host "  $message"
}

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

# ── Pre-flight checks ────────────────────────────────────────────────────────

if (-not $SkipChecks) {

  # Node.js
  if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "  [ERROR] Node.js no encontrado. Instala desde https://nodejs.org" -ForegroundColor Red
    exit 1
  }

  # server/.env
  $envFile = Join-Path $ROOT "server\.env"
  $envExample = Join-Path $ROOT "server\.env.example"
  if (-not (Test-Path $envFile)) {
    if (Test-Path $envExample) {
      Copy-Item $envExample $envFile
      Write-Host "  [WARN] server/.env creado desde .env.example" -ForegroundColor Yellow
      Write-Host "         Edita DATABASE_URL si tienes PostgreSQL configurado." -ForegroundColor DarkYellow
      Write-Host ""
    } else {
      Write-Host "  [ERROR] server/.env no existe y tampoco .env.example" -ForegroundColor Red
      exit 1
    }
  }

  # frontend deps
  if (-not (Test-Path (Join-Path $ROOT "node_modules"))) {
    Write-Host "  [INFO] Instalando dependencias del frontend..." -ForegroundColor Cyan
    Push-Location $ROOT
    pnpm install
    Pop-Location
  }

  # backend deps
  if (-not (Test-Path (Join-Path $ROOT "server\node_modules"))) {
    Write-Host "  [INFO] Instalando dependencias del backend..." -ForegroundColor Yellow
    Push-Location (Join-Path $ROOT "server")
    npm install
    Pop-Location
  }
}

Write-Header

# ── Launch jobs ──────────────────────────────────────────────────────────────

$frontJob = Start-Job -Name "FRONT" -ScriptBlock {
  param($root)
  Set-Location $root
  & pnpm dev 2>&1
} -ArgumentList $ROOT

$backJob = Start-Job -Name "BACK" -ScriptBlock {
  param($root)
  Set-Location (Join-Path $root "server")
  & npm run dev 2>&1
} -ArgumentList $ROOT

Write-Tag "FRONT" "Cyan"  "Vite iniciado (job $($frontJob.Id))"
Write-Tag "BACK"  "Yellow" "Express iniciado (job $($backJob.Id))"
Write-Host ""
Write-Host "  Presiona " -NoNewline
Write-Host "Ctrl+C" -NoNewline -ForegroundColor Red
Write-Host " para detener ambos servicios."
Write-Host ""

# ── Stream output ────────────────────────────────────────────────────────────

try {
  while ($true) {
    # Drain frontend output
    $frontOut = Receive-Job -Job $frontJob -ErrorAction SilentlyContinue
    foreach ($line in ($frontOut -split "`n")) {
      if ($line.Trim()) {
        $ts = (Get-Date).ToString("HH:mm:ss")
        Write-Host "  [$ts] " -NoNewline -ForegroundColor DarkGray
        Write-Host " FRONT " -NoNewline -BackgroundColor Cyan -ForegroundColor Black
        Write-Host "  $line"
      }
    }

    # Drain backend output
    $backOut = Receive-Job -Job $backJob -ErrorAction SilentlyContinue
    foreach ($line in ($backOut -split "`n")) {
      if ($line.Trim()) {
        $ts = (Get-Date).ToString("HH:mm:ss")
        Write-Host "  [$ts] " -NoNewline -ForegroundColor DarkGray
        Write-Host " BACK  " -NoNewline -BackgroundColor Yellow -ForegroundColor Black
        Write-Host "  $line"
      }
    }

    # Check if either job has stopped
    if ($frontJob.State -eq 'Failed' -or $frontJob.State -eq 'Completed') {
      Write-Tag "FRONT" "Red" "El proceso del frontend se detuvo (estado: $($frontJob.State))"
      break
    }
    if ($backJob.State -eq 'Failed' -or $backJob.State -eq 'Completed') {
      Write-Tag "BACK" "Red" "El proceso del backend se detuvo (estado: $($backJob.State))"
      break
    }

    Start-Sleep -Milliseconds 300
  }
}
finally {
  # ── Cleanup on Ctrl+C or crash ───────────────────────────────────────────
  Write-Host ""
  Write-Tag "SYS" "DarkGray" "Deteniendo servicios..."
  Stop-Job  -Job $frontJob -ErrorAction SilentlyContinue
  Stop-Job  -Job $backJob  -ErrorAction SilentlyContinue
  Remove-Job -Job $frontJob -Force -ErrorAction SilentlyContinue
  Remove-Job -Job $backJob  -Force -ErrorAction SilentlyContinue
  Write-Tag "SYS" "DarkGray" "Servicios detenidos. ¡Hasta luego!"
  Write-Host ""
}

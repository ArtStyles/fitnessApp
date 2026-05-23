@echo off
setlocal EnableDelayedExpansion
chcp 65001 > nul

echo.
echo  ███████╗██╗████████╗███████╗ ██████╗ ██████╗  ██████╗ ███████╗
echo  ██╔════╝██║╚══██╔══╝██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝
echo  █████╗  ██║   ██║   █████╗  ██║   ██║██████╔╝██║  ███╗█████╗
echo  ██╔══╝  ██║   ██║   ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝
echo  ██║     ██║   ██║   ██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
echo  ╚═╝     ╚═╝   ╚═╝   ╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
echo.
echo  Dev Environment Launcher
echo  ─────────────────────────────────────────────────────────────────
echo.

:: ── Check Node ───────────────────────────────────────────────────────────────
where node >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js no encontrado. Instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)

:: ── Check server .env ────────────────────────────────────────────────────────
if not exist "server\.env" (
    echo  [WARN] server\.env no encontrado.
    echo  Copiando server\.env.example a server\.env ...
    if exist "server\.env.example" (
        copy "server\.env.example" "server\.env" >nul
        echo  [OK]   server\.env creado — edita DATABASE_URL antes de continuar.
        echo.
    ) else (
        echo  [ERROR] server\.env.example tampoco existe. Crea server\.env manualmente.
        pause
        exit /b 1
    )
)

:: ── Check frontend node_modules ───────────────────────────────────────────────
if not exist "node_modules" (
    echo  [INFO] Instalando dependencias del frontend...
    call pnpm install
    if errorlevel 1 (
        echo  [ERROR] Fallo instalacion frontend
        pause
        exit /b 1
    )
)

:: ── Check server node_modules ────────────────────────────────────────────────
if not exist "server\node_modules" (
    echo  [INFO] Instalando dependencias del backend...
    pushd server
    call npm install
    popd
    if errorlevel 1 (
        echo  [ERROR] Fallo instalacion backend
        pause
        exit /b 1
    )
)

echo.
echo  Levantando servicios...
echo  ─────────────────────────────────────────────────────────────────
echo   Frontend  →  http://localhost:5173
echo   Backend   →  http://localhost:3001
echo   Health    →  http://localhost:3001/health
echo  ─────────────────────────────────────────────────────────────────
echo.

:: ── Launch backend in new window ─────────────────────────────────────────────
start "FitForge :: BACKEND :3001" cmd /k "cd /d %~dp0server && echo [BACK] Iniciando backend... && npm run dev"

:: ── Small delay so backend starts first ──────────────────────────────────────
timeout /t 2 /nobreak >nul

:: ── Launch frontend in new window ────────────────────────────────────────────
start "FitForge :: FRONTEND :5173" cmd /k "cd /d %~dp0 && echo [FRONT] Iniciando frontend... && pnpm dev"

echo  [OK] Ambos servicios iniciados en ventanas separadas.
echo.
echo  Cierra las ventanas de CMD para detener los servicios.
echo.
pause

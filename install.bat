@echo off

echo ====================================
echo RIC DataBridge Connector Installer
echo ====================================

docker --version >nul 2>&1

if errorlevel 1 (
    echo.
    echo Docker Desktop is not installed.
    echo Please install Docker Desktop and rerun.
    start https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

echo.
echo Pulling latest image...

docker pull ghcr.io/Ricengg/ric-databridge-connector:1.0.0

if not exist data mkdir data
if not exist logs mkdir logs

echo.
echo Removing existing container...

docker rm -f ric-databridge-connector >nul 2>&1

echo.
echo Starting container...

docker run -d ^
 --name ric-databridge-connector ^
 --restart unless-stopped ^
 --env-file .env ^
 -v "%cd%\data:/app/data" ^
 -v "%cd%\logs:/app/logs" ^
 ghcr.io/Ricengg/ric-databridge-connector:1.0.0

echo.
echo ====================================
echo Installation Complete
echo ====================================

docker ps

pause
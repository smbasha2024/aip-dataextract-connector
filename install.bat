@echo off

echo ====================================
echo AIP DataExtract Connector Installer
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

# GitHub Container Registry Login
echo "Logging into GitHub Container Registry..."

echo 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 | docker login ghcr.io -u smbasha2024 --password-stdin
if [ $? -ne 0 ]; then
    echo "GHCR Login Failed"
    exit 1
fi
docker pull ghcr.io/smbasha2024/aip-databextract-connector:1.0.0

if not exist data mkdir data
if not exist logs mkdir logs

echo.
echo Removing existing container...

docker rm -f aip-databextract-connector >/dev/null 2>&1 || true

echo.
echo Starting container...

docker run -d ^
 --name aip-databextract-connector ^
 --restart unless-stopped ^
 --env-file .env ^
 -v "%cd%\data:/app/data" ^
 -v "%cd%\logs:/app/logs" ^
 ghcr.io/smbasha2024/aip-databextract-connector:1.0.0

echo.
echo ====================================
echo Installation Complete
echo ====================================

docker ps -a --filter "name=aip-databextract-connector"

if ! docker ps --filter "name=aip-databextract-connector" --format "{{.Names}}" | grep -q "^aip-databextract-connector$"
then
docker logs aip-databextract-connector
fi

echo ""
echo "Container Status:"
docker ps -a --filter "name=aip-databextract-connector"

pause
@echo off
setlocal

echo ====================================
echo AIP DataExtract Connector Installer
echo ====================================

REM -----------------------------------------------------
REM Image and Version
REM Usage:
REM   install.bat           -> latest
REM   install.bat 0.3.0     -> version 0.3.0
REM -----------------------------------------------------

set IMAGE=ghcr.io/smbasha2024/aip-dataextract-connector

if "%~1"=="" (
    set TAG=latest
) else (
    set TAG=%~1
)

echo Installing version: %TAG%
echo.

REM -----------------------------------------------------
REM Check Docker
REM -----------------------------------------------------

docker --version >nul 2>&1
if errorlevel 1 (
    echo Docker Desktop is not installed or not running.
    echo Please install/start Docker Desktop and try again.
    pause
    exit /b 1
)

REM -----------------------------------------------------
REM Login to GHCR
REM -----------------------------------------------------

echo Logging into GitHub Container Registry...

echo <enter token>| docker login ghcr.io -u smbasha2024 --password-stdin

if errorlevel 1 (
    echo.
    echo GHCR Login Failed.
    pause
    exit /b 1
)

REM -----------------------------------------------------
REM Pull Image
REM -----------------------------------------------------

echo.
echo Pulling image %IMAGE%:%TAG%

docker pull %IMAGE%:%TAG%

if errorlevel 1 (
    echo.
    echo Failed to pull image.
    pause
    exit /b 1
)

REM -----------------------------------------------------
REM Create folders
REM -----------------------------------------------------

if not exist data mkdir data
if not exist logs mkdir logs

REM -----------------------------------------------------
REM Remove existing container
REM -----------------------------------------------------

echo.
echo Removing existing container...

docker rm -f aip-dataextract-connector >nul 2>&1

REM -----------------------------------------------------
REM Start Container
REM -----------------------------------------------------

echo.
echo Starting container...

docker run -d ^
  --name aip-dataextract-connector ^
  --restart unless-stopped ^
  --env-file .env ^
  -p 5050:5050 ^
  -v "%cd%\data:/app/data" ^
  -v "%cd%\logs:/app/logs" ^
  %IMAGE%:%TAG%

REM -----------------------------------------------------
REM Show Status
REM -----------------------------------------------------

echo.
echo Container Status:
docker ps -a --filter "name=aip-dataextract-connector"

REM -----------------------------------------------------
REM Show logs if container isn't running
REM -----------------------------------------------------

docker inspect -f "{{.State.Running}}" aip-dataextract-connector 2>nul | findstr /I "true" >nul

if errorlevel 1 (
    echo.
    echo Container failed to start.
    echo Logs:
    docker logs aip-dataextract-connector
)

echo.
echo ====================================
echo Installation Complete
echo ====================================

pause
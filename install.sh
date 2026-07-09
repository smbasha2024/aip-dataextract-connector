#!/bin/bash

echo "===================================="
echo "AIP DataExtract Connector Installer"
echo "===================================="

if ! command -v docker &> /dev/null
then
    echo "Docker not found."
    echo "Install Docker and rerun."
    exit 1
fi

# GitHub Container Registry Login
echo "Logging into GitHub Container Registry..."

echo <enter key> | docker login ghcr.io -u smbasha2024 --password-stdin
if [ $? -ne 0 ]; then
    echo "GHCR Login Failed"
    exit 1
fi
docker pull ghcr.io/smbasha2024/aip-databextract-connector:1.0.6

mkdir -p data
mkdir -p logs

docker rm -f aip-databextract-connector >/dev/null 2>&1 || true

docker run -d \
  --name aip-databextract-connector \
  --restart unless-stopped \
  --env-file .env \
  -p 5050:5050 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/logs:/app/logs \
  ghcr.io/smbasha2024/aip-databextract-connector:1.0.6

docker ps -a --filter "name=aip-databextract-connector"

if ! docker ps --filter "name=aip-databextract-connector" --format "{{.Names}}" | grep -q "^aip-databextract-connector$"
then
docker logs aip-databextract-connector
fi

echo ""
echo "Container Status:"
docker ps -a --filter "name=aip-databextract-connector"

echo "Installation Complete"
#!/bin/bash

echo "===================================="
echo "RIC DataBridge Connector Installer"
echo "===================================="

if ! command -v docker &> /dev/null
then
    echo "Docker not found."
    echo "Install Docker and rerun."
    exit 1
fi

docker pull ghcr.io/Ricengg/ric-databridge-connector:1.0.0

mkdir -p data
mkdir -p logs

docker rm -f ric-databridge-connector || true

docker run -d \
  --name ric-databridge-connector \
  --restart unless-stopped \
  --env-file .env \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/logs:/app/logs \
  ghcr.io/Ricengg/ric-databridge-connector:1.0.0

docker ps

echo "Installation Complete"
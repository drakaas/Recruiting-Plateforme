#!/bin/bash

# Script to install Docker Compose correctly
# This fixes the "cannot execute binary file" error

set -e

echo "🔧 Installing Docker Compose..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo "Please install Docker first:"
    echo "  curl -fsSL https://get.docker.com -o get-docker.sh"
    echo "  sudo sh get-docker.sh"
    exit 1
fi

# Check if Docker Compose V2 is already available
if docker compose version &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose V2 is already installed!${NC}"
    docker compose version
    echo ""
    echo "You can use: docker compose (with space)"
    exit 0
fi

# Detect architecture
ARCH=$(uname -m)
echo -e "${YELLOW}📐 Detected architecture: $ARCH${NC}"

# Map architecture to Docker Compose binary name
case "$ARCH" in
    x86_64)
        COMPOSE_ARCH="x86_64"
        ;;
    aarch64|arm64)
        COMPOSE_ARCH="aarch64"
        ;;
    armv7l|armv6l)
        COMPOSE_ARCH="armv7"
        ;;
    *)
        echo -e "${RED}❌ Unsupported architecture: $ARCH${NC}"
        echo "Please install Docker Compose manually"
        exit 1
        ;;
esac

echo -e "${YELLOW}📦 Downloading Docker Compose for $COMPOSE_ARCH...${NC}"

# Remove old binary if exists
if [ -f /usr/local/bin/docker-compose ]; then
    echo -e "${YELLOW}🗑️  Removing old docker-compose binary...${NC}"
    sudo rm -f /usr/local/bin/docker-compose
fi

# Download correct binary
COMPOSE_VERSION="v2.24.0"
DOWNLOAD_URL="https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-linux-${COMPOSE_ARCH}"

echo "Downloading from: $DOWNLOAD_URL"

sudo curl -L "$DOWNLOAD_URL" -o /usr/local/bin/docker-compose || {
    echo -e "${RED}❌ Download failed!${NC}"
    echo "Trying alternative method..."
    
    # Alternative: Use latest release
    LATEST_URL=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep "browser_download_url.*linux-${COMPOSE_ARCH}" | cut -d '"' -f 4)
    if [ -z "$LATEST_URL" ]; then
        echo -e "${RED}❌ Could not find download URL${NC}"
        exit 1
    fi
    echo "Using latest release: $LATEST_URL"
    sudo curl -L "$LATEST_URL" -o /usr/local/bin/docker-compose
}

# Make executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
if docker-compose --version &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose installed successfully!${NC}"
    docker-compose --version
else
    echo -e "${RED}❌ Installation failed!${NC}"
    echo "Trying Docker Compose V2 plugin method..."
    
    # Try installing as plugin
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
    
    if docker compose version &> /dev/null; then
        echo -e "${GREEN}✅ Docker Compose V2 plugin installed!${NC}"
        docker compose version
        echo ""
        echo "Use: docker compose (with space)"
    else
        echo -e "${RED}❌ All installation methods failed${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}✅ Installation complete!${NC}"
echo ""
echo "You can now run: ./deploy.sh"


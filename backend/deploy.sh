#!/bin/bash

# Deployment script for Recruiting Platform Backend
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo "Please create a .env file with your configuration."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    exit 1
fi

# Detect Docker Compose command (docker-compose or docker compose)
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo -e "${RED}❌ Docker Compose is not installed!${NC}"
    echo "Please install Docker Compose:"
    echo "  - For older versions: https://docs.docker.com/compose/install/"
    echo "  - For newer versions: Docker Compose is included with Docker Desktop"
    exit 1
fi

echo -e "${GREEN}✅ Using: $DOCKER_COMPOSE${NC}"

echo -e "${YELLOW}📦 Building Docker images...${NC}"
$DOCKER_COMPOSE build

echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
$DOCKER_COMPOSE down

echo -e "${YELLOW}🚀 Starting containers...${NC}"
$DOCKER_COMPOSE up -d

echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check backend health through Nginx
for i in {1..30}; do
    if curl -f http://localhost/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is healthy!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Health check failed after 30 attempts${NC}"
        echo -e "${YELLOW}Checking container logs...${NC}"
        $DOCKER_COMPOSE logs backend
        $DOCKER_COMPOSE logs nginx
        exit 1
    fi
    sleep 1
done

# Check Nginx
for i in {1..10}; do
    if curl -f http://localhost/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Nginx is routing correctly!${NC}"
        break
    fi
    if [ $i -eq 10 ]; then
        echo -e "${YELLOW}⚠️  Nginx routing check failed, but backend is up${NC}"
    fi
    sleep 1
done

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "📊 Container status:"
$DOCKER_COMPOSE ps

echo ""
echo "🌐 Services available at:"
echo "   - API: http://localhost/api"
echo "   - Health: http://localhost/health"
echo ""
echo "📝 View logs:"
echo "   - Backend: $DOCKER_COMPOSE logs -f backend"
echo "   - Nginx: $DOCKER_COMPOSE logs -f nginx"
echo "   - All: $DOCKER_COMPOSE logs -f"
echo ""
echo "🛑 Stop with: $DOCKER_COMPOSE down"
echo "🔄 Restart with: $DOCKER_COMPOSE restart"


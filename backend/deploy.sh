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

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed!${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Building Docker image...${NC}"
docker-compose build

echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose down

echo -e "${YELLOW}🚀 Starting containers...${NC}"
docker-compose up -d

echo -e "${YELLOW}⏳ Waiting for backend to be ready...${NC}"
sleep 5

# Check health
for i in {1..30}; do
    if curl -f http://localhost:4000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is healthy!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Backend health check failed after 30 attempts${NC}"
        docker-compose logs backend
        exit 1
    fi
    sleep 1
done

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo "📊 Container status:"
docker-compose ps

echo ""
echo "📝 View logs with: docker-compose logs -f backend"
echo "🛑 Stop with: docker-compose down"
echo "🔄 Restart with: docker-compose restart backend"


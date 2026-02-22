#!/bin/bash

# 🚀 Hackazon Quick Start Script
# Automatically sets up and starts the entire vulnerable application

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║          🔒 Hackazon Quick Start Script 🔒                  ║"
echo "║     Intentionally Vulnerable E-Commerce Application        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}"
echo ""

# Stop any existing containers
echo -e "${YELLOW}📦 Stopping existing containers...${NC}"
docker-compose down 2>/dev/null || true
echo ""

# Proactively rebuild images so apt mirrors use HTTPS before starting
echo -e "${YELLOW}🔧 Building Docker images (forcing HTTPS mirrors)...${NC}"
if ! docker-compose build api; then
    echo -e "${RED}✗ Image build failed. Ensure outbound HTTPS (443) access to deb.debian.org is allowed and rerun.${NC}"
    exit 1
fi
echo ""

# Start services
echo -e "${YELLOW}🚀 Starting all services...${NC}"
docker-compose up -d

echo ""
echo -e "${YELLOW}⏳ Waiting for services to initialize...${NC}"
sleep 15

# Check if database is ready
echo -e "${YELLOW}🗄️  Checking database status...${NC}"
until docker exec shopsmart-db pg_isready -U shop > /dev/null 2>&1; do
    echo "   Waiting for database..."
    sleep 2
done
echo -e "${GREEN}✓ Database is ready${NC}"
echo ""

# Run database migrations

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

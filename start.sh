#!/bin/bash

echo "🚀 Starting ShopSmart Development Environment..."
echo ""

# Stop any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f 'nodemon' 2>/dev/null || true
pkill -f 'next dev' 2>/dev/null || true

# Start Docker services
echo "🐳 Starting Docker services (DB, Redis, Internal API)..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for database to be ready..."
until docker exec shopsmart-db pg_isready -U shop &>/dev/null; do
  echo -n "."
  sleep 1
done
echo " ✅ Database ready!"


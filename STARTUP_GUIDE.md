# ShopSmart - Quick Start Guide

This guide will help you get the ShopSmart platform up and running quickly.

## Architecture

- **Docker**: Runs PostgreSQL, Redis, and Internal API (for SSRF testing)
- **Local Node.js**: Runs the Backend API and Frontend (faster, no build issues)

## Prerequisites

- Docker and Docker Compose
- Node.js v20+ and npm
- Port availability: 3000 (Frontend), 4000 (Backend), 5000 (Internal API), 5432 (PostgreSQL), 6379 (Redis)

## Quick Start (Recommended)

### Option 1: Use the startup script (Easiest)

```bash
./start.sh
```

This script will:
1. Clean up any existing processes
2. Start Docker services (DB, Redis, Internal API)
3. Wait for the database to be ready
4. Set up and seed the database
5. Start both API and Frontend servers concurrently

Press `Ctrl+C` to stop all services.

### Option 2: Manual step-by-step

```bash
# 1. Start Docker services
npm run docker:up

# 2. Seed the database
npm run db:seed

# 3. Start development servers
npm run dev
```

### Option 3: All-in-one command

```bash
npm start
```

## Available Scripts

### Main Commands

- `npm start` - Start everything (Docker + DB seed + Dev servers)
- `npm run dev` - Start API and Frontend concurrently (assumes Docker is running)

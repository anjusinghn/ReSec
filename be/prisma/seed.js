const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const pathModule = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

 console.log('🧹 Resetting existing data...');
 await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.review.deleteMany(),
    prisma.wishlistItem.deleteMany(),
    prisma.adminSecret.deleteMany(),
    prisma.product.deleteMany(),
    prisma.user.deleteMany()
  ]);
  console.log('✓ Cleared tables');

  // Create admin user with flag in secretNote
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@shopsmart.com',
      passwordHash: adminPasswordHash,

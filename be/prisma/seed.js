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
      role: 'admin',
      displayName: 'Administrator',
      secretNote: `PCTFS{${uuidv4()}}` // IDOR FLAG
    }
  });
  console.log('✓ Created admin user');

  // Create regular users
  const regularPasswordHash = await bcrypt.hash('password123', 10);
  const user1 = await prisma.user.create({
    data: {
      username: 'johndoe',
      email: 'john@example.com',
      passwordHash: regularPasswordHash,
      role: 'user',
      displayName: 'John Doe'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'janedoe',
      email: 'jane@example.com',
      passwordHash: regularPasswordHash,
      role: 'user',
      displayName: 'Jane Doe'
    }
  });
  console.log('✓ Created regular users');

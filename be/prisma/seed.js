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
  const productsFile = pathModule.join(__dirname, 'seed-data', 'products.json');
  const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

  const createdProducts = [];
  for (const product of products) {
    const created = await prisma.product.create({
      data: product
    });
    createdProducts.push(created);
  }
  console.log('✓ Created products');

  // Create admin order with flag in giftNote
  const adminOrder = await prisma.order.create({
    data: {
      userId: adminUser.id,
      status: 'delivered',
      totalCents: 39998,
      giftNote: `PCTFS{${uuidv4()}}`, // IDOR FLAG
      items: {
        create: [
          { productId: createdProducts[0].id, qty: 2, priceCents: createdProducts[0].priceCents },
          { productId: createdProducts[1].id, qty: 1, priceCents: createdProducts[1].priceCents }
        ]
      }
    }
  });
  console.log('✓ Created admin order with flag');

  // Create regular orders

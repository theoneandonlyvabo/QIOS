import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function main() {
  // Create initial store
  logger.info('Creating store...');
  const store = await prisma.store.create({
    data: {
      name: 'QIOS Demo Store',
      address: 'Jl. Demo No. 123',
      phone: '+6281234567890',
      email: 'demo@qios.com',
    }
  });

  logger.info('Creating users...');
  const users = await prisma.user.createMany({
    data: [
      {
        name: 'Admin User',
        email: 'admin@qios.com',
        role: 'OWNER',
        storeId: store.id,
      },
      {
        name: 'Staff 1',
        email: 'staff1@qios.com',
        role: 'STAFF',
        storeId: store.id,
      }
    ]
  });

  logger.info('Creating customers...');
  const customers = await prisma.customer.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+6281234567890',
        segment: 'REGULAR',
        storeId: store.id,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+6289876543210',
        segment: 'VIP',
        storeId: store.id,
      }
    ]
  });

  logger.info('Creating products...');
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Product 1',
        description: 'Sample product 1',
        category: 'BEVERAGE',
        price: 100000,
        cost: 70000,
        stockQuantity: 50,
        minStockLevel: 10,
        sku: 'PRD001',
        storeId: store.id,
      },
      {
        name: 'Product 2',
        description: 'Sample product 2',
        category: 'FOOD',
        price: 150000,
        cost: 100000,
        stockQuantity: 30,
        minStockLevel: 5,
        sku: 'PRD002',
        storeId: store.id,
      }
    ]
  });

  // Create sample orders
  logger.info('Creating orders...');
  const customerRecords = await prisma.customer.findMany();
  const productRecords = await prisma.product.findMany();
  const staffUser = await prisma.user.findFirst({ where: { role: 'STAFF' } });

  for (const customer of customerRecords) {
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD${Date.now()}`,
        customerId: customer.id,
        storeId: store.id,
        userId: staffUser?.id,
        status: 'COMPLETED',
        paymentMethod: 'CASH',
        paymentStatus: 'PAID',
        subtotal: 250000,
        tax: 25000,
        total: 275000,
        transactionDate: new Date(),
        items: {
          create: productRecords.map((product: any) => ({
            productId: product.id,
            quantity: 1,
            price: product.price,
            subtotal: product.price,
          }))
        }
      },
    });

    // Create notification for the order
    await prisma.notification.create({
      data: {
        type: 'ORDER',
        title: 'New Order',
        message: `New order #${order.orderNumber} from ${customer.name}`,
        storeId: store.id,
        severity: 'SUCCESS',
        isRead: false,
      }
    });

    // Create stock movements for the products
    for (const product of productRecords) {
      await prisma.stockMovement.create({
        data: {
          productId: product.id,
          type: 'OUT',
          quantity: 1,
          notes: `Order #${order.orderNumber}`,
        }
      });
    }
  }

  logger.info(`✅ Seeded store: ${store.name}`);
  logger.info(`✅ Seeded ${users.count} users`);
  logger.info(`✅ Seeded ${customers.count} customers`);
  logger.info(`✅ Seeded ${products.count} products`);
  logger.info(`✅ Database seeded successfully`);
}

main()
  .catch((e) => {
    logger.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
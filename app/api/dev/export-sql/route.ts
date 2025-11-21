import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 });
  }

  try {
    // Fetch all data
    const [rawMaterials, products, recipes, customers, orders, movements, notifications] = await Promise.all([
      prisma.rawMaterial.findMany(),
      prisma.product.findMany(),
      prisma.recipe.findMany(),
      prisma.customer.findMany(),
      prisma.order.findMany({ include: { items: true } }),
      prisma.rawMaterialMovement.findMany(),
      prisma.notification.findMany()
    ]);

    // Generate SQL
    let sql = `-- QIOS Test Data Export
-- Generated: ${new Date().toISOString()}
-- 

-- Raw Materials
`;

    for (const rm of rawMaterials) {
      sql += `INSERT INTO "RawMaterial" ("id", "name", "stock", "unit", "minStockLevel", "initialStock", "cost", "storeId", "createdAt", "updatedAt") VALUES ('${rm.id}', '${rm.name}', ${rm.stock}, '${rm.unit}', ${rm.minStockLevel}, ${rm.initialStock}, ${rm.cost}, '${rm.storeId}', '${rm.createdAt.toISOString()}', '${rm.updatedAt.toISOString()}');\n`;
    }

    sql += `\n-- Products\n`;
    for (const p of products) {
      sql += `INSERT INTO "Product" ("id", "sku", "name", "category", "price", "cost", "stockQuantity", "minStockLevel", "isFinishedProduct", "storeId", "createdAt", "updatedAt") VALUES ('${p.id}', '${p.sku}', '${p.name}', '${p.category}', ${p.price}, ${p.cost}, ${p.stockQuantity}, ${p.minStockLevel}, ${p.isFinishedProduct}, '${p.storeId}', '${p.createdAt.toISOString()}', '${p.updatedAt.toISOString()}');\n`;
    }

    sql += `\n-- Recipes\n`;
    for (const r of recipes) {
      sql += `INSERT INTO "Recipe" ("id", "productId", "rawMaterialId", "quantity", "createdAt") VALUES ('${r.id}', '${r.productId}', '${r.rawMaterialId}', ${r.quantity}, '${r.createdAt.toISOString()}');\n`;
    }

    sql += `\n-- Customers\n`;
    for (const c of customers) {
      sql += `INSERT INTO "Customer" ("id", "name", "email", "phone", "segment", "totalTransactions", "totalSpent", "storeId", "createdAt", "updatedAt") VALUES ('${c.id}', '${c.name}', ${c.email ? `'${c.email}'` : 'NULL'}, '${c.phone}', '${c.segment}', ${c.totalTransactions}, ${c.totalSpent}, '${c.storeId}', '${c.createdAt.toISOString()}', '${c.updatedAt.toISOString()}');\n`;
    }

    sql += `\n-- Orders and Items\n`;
    for (const o of orders) {
      sql += `INSERT INTO "Order" ("id", "orderNumber", "customerId", "storeId", "status", "paymentMethod", "paymentStatus", "paymentReference", "subtotal", "tax", "discount", "total", "transactionDate", "createdAt", "updatedAt") VALUES ('${o.id}', '${o.orderNumber}', '${o.customerId}', '${o.storeId}', '${o.status}', '${o.paymentMethod}', '${o.paymentStatus}', ${o.paymentReference ? `'${o.paymentReference}'` : 'NULL'}, ${o.subtotal}, ${o.tax}, ${o.discount}, ${o.total}, '${o.transactionDate.toISOString()}', '${o.createdAt.toISOString()}', '${o.updatedAt.toISOString()}');\n`;
      
      for (const item of o.items) {
        sql += `INSERT INTO "OrderItem" ("id", "orderId", "productId", "quantity", "price", "subtotal", "createdAt") VALUES ('${item.id}', '${item.orderId}', '${item.productId}', ${item.quantity}, ${item.price}, ${item.subtotal}, '${item.createdAt.toISOString()}');\n`;
      }
    }

    sql += `\n-- Raw Material Movements\n`;
    for (const m of movements) {
      sql += `INSERT INTO "RawMaterialMovement" ("id", "rawMaterialId", "type", "quantity", "notes", "orderId", "createdAt") VALUES ('${m.id}', '${m.rawMaterialId}', '${m.type}', ${m.quantity}, ${m.notes ? `'${m.notes}'` : 'NULL'}, ${m.orderId ? `'${m.orderId}'` : 'NULL'}, '${m.createdAt.toISOString()}');\n`;
    }

    sql += `\n-- Notifications\n`;
    for (const n of notifications) {
      sql += `INSERT INTO "Notification" ("id", "storeId", "type", "title", "message", "severity", "isRead", "createdAt") VALUES ('${n.id}', ${n.storeId ? `'${n.storeId}'` : 'NULL'}, '${n.type}', '${n.title}', '${n.message}', '${n.severity}', ${n.isRead}, '${n.createdAt.toISOString()}');\n`;
    }

    // Return as downloadable file
    return new NextResponse(sql, {
      headers: {
        'Content-Type': 'application/sql',
        'Content-Disposition': `attachment; filename="qios-export-${Date.now()}.sql"`
      }
    });

  } catch (error) {
    console.error('Export failed:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
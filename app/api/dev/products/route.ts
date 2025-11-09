import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available' }, { status: 403 });
  }

  try {
    console.log('[DEV API] Fetching products...');

    const totalProducts = await prisma.product.count();
    console.log(`[DEV API] Total products in DB: ${totalProducts}`);

    if (totalProducts === 0) {
      return NextResponse.json({ products: [], warning: 'No products found. Run seed: npx ts-node prisma/seed-coffee-shop.ts' });
    }

    const products = await prisma.product.findMany({
      include: {
        recipes: {
          include: {
            rawMaterial: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    console.log(`[DEV API] Returning ${products.length} products`);

    return NextResponse.json({ products, count: products.length });
  } catch (error: any) {
    console.error('[DEV API] Products fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch products', details: error?.message }, { status: 500 });
  }
}
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCoffeeShop() {
  // Create default store first
  const store = await prisma.store.create({
    data: {
      id: 'default-store',
      name: 'QIOS Coffee Shop',
      address: 'Jl. Test No. 123',
      phone: '08123456789',
      email: 'qios@example.com'
    }
  });
  
  const storeId = store.id;

  // 1. Create Raw Materials
  const rawMaterials = await Promise.all([
    prisma.rawMaterial.create({
      data: {
        name: 'Kopi Beans',
        stock: 5000,
        unit: 'gram',
        minStockLevel: 1000,
        initialStock: 5000,
        cost: 150, // Rp per gram
        storeId
      }
    }),
    prisma.rawMaterial.create({
      data: {
        name: 'Susu',
        stock: 10000,
        unit: 'ml',
        minStockLevel: 2000,
        initialStock: 10000,
        cost: 15, // Rp per ml
        storeId
      }
    }),
    prisma.rawMaterial.create({
      data: {
        name: 'Gula',
        stock: 2000,
        unit: 'gram',
        minStockLevel: 400,
        initialStock: 2000,
        cost: 20, // Rp per gram
        storeId
      }
    }),
    prisma.rawMaterial.create({
      data: {
        name: 'Roti',
        stock: 50,
        unit: 'pcs',
        minStockLevel: 10,
        initialStock: 50,
        cost: 8000, // Rp per pcs
        storeId
      }
    })
  ]);

  console.log('✅ Raw materials created');

  // 2. Create Finished Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        sku: 'COFFEE-AMERICANO',
        name: 'Americano',
        category: 'Coffee',
        price: 25000,
        cost: 0, // will calculate from recipe
        isFinishedProduct: true,
        storeId
      }
    }),
    prisma.product.create({
      data: {
        sku: 'COFFEE-LATTE',
        name: 'Latte',
        category: 'Coffee',
        price: 30000,
        cost: 0,
        isFinishedProduct: true,
        storeId
      }
    }),
    prisma.product.create({
      data: {
        sku: 'COFFEE-CAPPUCCINO',
        name: 'Cappuccino',
        category: 'Coffee',
        price: 32000,
        cost: 0,
        isFinishedProduct: true,
        storeId
      }
    }),
    prisma.product.create({
      data: {
        sku: 'SNACK-ROTI',
        name: 'Roti',
        category: 'Snacks',
        price: 15000,
        cost: 8000,
        isFinishedProduct: false, // direct sell
        storeId
      }
    })
  ]);

  console.log('✅ Products created');

  // 3. Create Recipes
  const [kopi, susu, gula, roti] = rawMaterials;
  const [americano, latte, cappuccino, rotiProduct] = products;

  await Promise.all([
    // Americano = 18g kopi + 5g gula
    prisma.recipe.create({
      data: {
        productId: americano.id,
        rawMaterialId: kopi.id,
        quantity: 18
      }
    }),
    prisma.recipe.create({
      data: {
        productId: americano.id,
        rawMaterialId: gula.id,
        quantity: 5
      }
    }),

    // Latte = 18g kopi + 200ml susu + 5g gula
    prisma.recipe.create({
      data: {
        productId: latte.id,
        rawMaterialId: kopi.id,
        quantity: 18
      }
    }),
    prisma.recipe.create({
      data: {
        productId: latte.id,
        rawMaterialId: susu.id,
        quantity: 200
      }
    }),
    prisma.recipe.create({
      data: {
        productId: latte.id,
        rawMaterialId: gula.id,
        quantity: 5
      }
    }),

    // Cappuccino = 18g kopi + 150ml susu + 5g gula
    prisma.recipe.create({
      data: {
        productId: cappuccino.id,
        rawMaterialId: kopi.id,
        quantity: 18
      }
    }),
    prisma.recipe.create({
      data: {
        productId: cappuccino.id,
        rawMaterialId: susu.id,
        quantity: 150
      }
    }),
    prisma.recipe.create({
      data: {
        productId: cappuccino.id,
        rawMaterialId: gula.id,
        quantity: 5
      }
    }),

    // Roti = direct link to raw material
    prisma.recipe.create({
      data: {
        productId: rotiProduct.id,
        rawMaterialId: roti.id,
        quantity: 1
      }
    })
  ]);

  console.log('✅ Recipes created');

  // 4. Update product costs based on recipes
  const updateCosts = products.map(async (product) => {
    const recipes = await prisma.recipe.findMany({
      where: { productId: product.id },
      include: { rawMaterial: true }
    });

    const totalCost = recipes.reduce((sum, recipe) => {
      return sum + (recipe.quantity * (recipe.rawMaterial?.cost || 0));
    }, 0);

    return prisma.product.update({
      where: { id: product.id },
      data: { cost: totalCost }
    });
  });

  await Promise.all(updateCosts);

  console.log('✅ Product costs calculated');
  console.log('🎉 Coffee shop seed completed!');
}

seedCoffeeShop()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

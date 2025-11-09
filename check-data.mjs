import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkData() {
  const store = await prisma.store.findFirst();
  console.log('\nStore:', store);
  
  const products = await prisma.product.findMany();
  console.log('\nProducts:', products);
  
  const rawMaterials = await prisma.rawMaterial.findMany();
  console.log('\nRaw Materials:', rawMaterials);
  
  const recipes = await prisma.recipe.findMany();
  console.log('\nRecipes:', recipes);
}

checkData()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
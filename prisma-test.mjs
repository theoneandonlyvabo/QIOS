import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:vano12345678@127.0.0.1:5432/qios_web?connect_timeout=5"
    }
  }
})

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT NOW()`
    console.log('Connected successfully:', result)
  } catch (e) {
    console.error('Failed to connect:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
const { PrismaClient } = require('@prisma/client');

let prisma;

// Help prevent multiple instances in dev
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log(`✅ PostgreSQL Connected via Prisma`);
  } catch (error) {
    console.error(`❌ PostgreSQL Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB, prisma };

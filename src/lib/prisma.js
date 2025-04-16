import { PrismaClient } from '../generated/prisma/index';

const globalForPrisma = global;

// Check if the client already exists to prevent multiple instances during hot reload
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log: [ 'error', 'warn'],
  });
}

export const prisma = globalForPrisma.prisma;
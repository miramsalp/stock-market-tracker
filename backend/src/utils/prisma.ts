import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const initializePrisma = async () => {
    try {
        await prisma.$connect();
        console.log('Prisma connected');
    } catch (error) {
        console.error('Error connecting to Prisma:', error);
    }
}   
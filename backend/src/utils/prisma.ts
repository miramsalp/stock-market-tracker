import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// const testDb = async () => {
//     let testUser = await prisma.user.findUnique({
//         where: {
//             email: 'test@example.com'
//         }
//     });

//     if (!testUser) {
//         testUser = await prisma.user.create({
//             data: {
//                 email: 'test@example.com',
//                 password: 'password123'
//             }
//         });
//         console.log('Test user created:', testUser.email);
//     } else {
//         console.log('Test user already exists:', testUser.email);
//     }
// }

export const initializePrisma = async () => {
    try {
        await prisma.$connect();
        console.log('Prisma connected');
        // await testDb();
    } catch (error) {
        console.error('Error connecting to Prisma:', error);
    }
}   
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'Test User',
            // Using Date.now() ensures a unique email if you run this multiple times
            email: `test_${Date.now()}@example.com`,
            password: 'password123',
        },
    });
    console.log('SUCCESS! Copy this User ID:', user.userId);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
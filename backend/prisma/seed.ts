import { PrismaClient } from '.prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { hash } from 'bcrypt'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.favourite.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    await prisma.user.create({
        data: {
            email: 'admin@mail.com',
            password: await hash('admin123', 10),
            isAdmin: true,
            address: 'Admin Ilica 1, Zagreb',
            paymentMethod: 'Visa **** 1234',
        }
    })

    await prisma.user.create({
        data: {
            email: 'user@mail.com',
            password: await hash('user123', 10),
            isAdmin: false,
            address: 'User Poljicka 5, Split',
            paymentMethod: 'Mastercard **** 5678',
        }
    })

    await prisma.category.createMany({
        data: [
            { name: 'Streetwear' },
            { name: 'Formal' },
            { name: 'Casual' },
            { name: 'Sport' },
            { name: 'Low' },
        ],
        skipDuplicates: true
    })

    const categoryRecords = await prisma.category.findMany()
    const categoryMap = Object.fromEntries(
        categoryRecords.map(c => [c.name.toLowerCase(), c.id])
    )

    const products = [
        { name: 'Air Max 90', 
        category: 'Casual', 
        brand: 'Nike', 
        price: 129.99, 
        sizes: ['40','41','42','43'], 
        colors: ['White','Black'], 
        inStock: true },

    ]

    for (const product of products) {
        const categoryId = categoryMap[product.category.toLowerCase()]
        if (!categoryId) {
            console.warn(`Kategorija nije pronađena za proizvod: ${product.name}`)
            continue
        }
        await prisma.product.create({
            data: {
                name: product.name,
                description: `${product.brand} ${product.name}`,
                price: product.price,
                brand: product.brand,
                imageUrl: `${product.name.replace(' ', '')}/400/400`,
                sizes: product.sizes,
                colors: product.colors,
                inStock: product.inStock,
                categoryId,
            }
        })
    }

    console.log('Seeding complete')
    console.log('Admin: admin@mail.com / admin123')
    console.log('User:  user@mail.com / user123')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
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
        { 
            name: 'Air Max 90', 
            category: 'Casual', 
            brand: 'Nike', 
            price: 129.99, 
            sizes: ['40','41','42','43'], 
            colors: ['White','Black'], 
            inStock: true 
        },
        {
            name:'Onitsuka Tiger Mexico 66',
            category: 'Streetwear',
            brand:'Onitsuka',
            price:89.90,
            sizes:['44', '45', '46', '47'],
            colors: ['Yellow', 'Red'],
            inStock: true
        },
        {
            name: 'Reserved T-shirt',
            category: 'Casual',
            brand: 'Reserved',
            price:9.90,
            sizes:['S', 'M', 'L'],
            colors: ['Black'],
            inStock: true
        },
        {
            name: 'Pull&Bear Hoodie',
            category: 'Casual',
            brand: 'Pull&Bear',
            price: 19.90,
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Black', 'Grey'],
            inStock: true
        },
        {
            name: 'Zara Sweatshirt',
            category: 'Casual',
            brand: 'Zara',
            price: 19.90,
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Black', 'Green'],
            inStock: true
        },
        {
            name: 'Bershka shirt',
            category: 'Formal',
            brand: 'Bershka',
            price: 29.90,
            sizes: ['S', 'M', 'L'],
            colors: ['Blue', 'Green'],
            inStock: true
        },
        {
            name: 'Bershka Spider-Man Long Sleeve',
            category: 'Streetwear',
            brand: 'Bershka',
            price: 29.90,
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Black'],
            inStock: true
        },
        {
            name: 'ACNE Studios Yoyogi 2021F Jeans',
            category: 'Streetwear',
            brand: 'ACNE Studios',
            price: 299.90,
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Black'],
            inStock: true
        },
        {
            name: 'Adidas Spezial',
            category: 'Streewear',
            brand: 'Adidas',
            price: 79.90,
            sizes: ['40', '41', '42', '43'],
            colors: ['Grey', 'Red'],
            inStock: true
        },
        {
            name: 'Nike Sports Jacket',
            category: 'Sport',
            brand: 'Nike',
            price: 104.95,
            sizes: ['S', 'M', 'L'],
            colors: ['Black'],
            inStock: true
        },
        {
            name: 'Adidas Performance Dres',
            category: 'Sport',
            brand: 'Adidas',
            price: 59.90,
            sizes: ['XS', 'S', 'M', 'L'],
            colors: ['Green'],
            inStock: true
        },
        {
            name: 'Puma Sports Jacket',
            category: 'Sport',
            brand: 'Puma',
            price: 50.90,
            sizes: ['S', 'M', 'L'],
            colors: ['Blue'],
            inStock: true
        },
        {
            name: 'Puma Sports Sweatpants',
            category: 'Sport',
            brand: 'Puma',
            price: 39.90,
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Grey'],
            inStock: true
        },
        {
            name: 'Nike Regular Sports Pants',
            category: 'Sport',
            brand: 'Nike',
            price: 20.00,
            sizes: ['S', 'M', 'L'],
            colors: ['Red', 'Green'],
            inStock: true
        },
        {
            name: 'Sinsay Black Pants',
            category: 'Formal',
            brand: 'Sinsay',
            price: 29.90,
            sizes: ['XS', 'S', 'M', 'L'],
            colors: ['Black'],
            inStock: true
        },
        {
            name: 'Zara Dress Shoes',
            category: 'Formal',
            brand: 'Zara',
            price: 49.90,
            sizes: ['37', '38', '39', '40', '41'],
            colors: ['Black'],
            inStock: true
        },
        {
            name: 'Bershka Sweatpants',
            category: 'Casual',
            brand: 'Bershka',
            price: 19.90,
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['White'],
            inStock: true
        }
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
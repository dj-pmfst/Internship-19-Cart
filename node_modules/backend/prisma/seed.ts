import { PrismaClient } from '.prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcrypt';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.favourite.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      email: 'admin@mail.com',
      password: await hash('admin123', 10),
      isAdmin: true,
      address: 'Admin Ilica 1, Zagreb',
      paymentMethod: 'Visa **** 1234',
    },
  });

  await prisma.user.create({
    data: {
      email: 'user@mail.com',
      password: await hash('user123', 10),
      isAdmin: false,
      address: 'User Poljicka 5, Split',
      paymentMethod: 'Mastercard **** 5678',
    },
  });

  await prisma.category.createMany({
    data: [
      { name: 'Streetwear' },
      { name: 'Formal' },
      { name: 'Casual' },
      { name: 'Sport' },
      { name: 'Low' },
    ],
    skipDuplicates: true,
  });

  const categoryRecords = await prisma.category.findMany();
  const categoryMap = Object.fromEntries(
    categoryRecords.map((c) => [c.name.toLowerCase(), c.id]),
  );

  const products = [
    {
      name: 'Air Max 90',
      category: 'Casual',
      brand: 'Nike',
      price: 129.99,
      sizes: ['40', '41', '42', '43'],
      colors: ['White', 'Black'],
      inStock: false,
      imageUrl: ['images/missing.jpg']
    },
    {
      name: 'Onitsuka Tiger Mexico 66',
      category: 'Streetwear',
      brand: 'Onitsuka',
      price: 89.9,
      sizes: ['44', '45', '46', '47'],
      colors: ['Yellow', 'Red'],
      inStock: true,
      imageUrl: [
        'images/lowshoesyellow.png',
        'images/onitsukatigermexico66.png',
      ],
    },
    {
      name: 'Reserved T-shirt',
      category: 'Casual',
      brand: 'Reserved',
      price: 9.9,
      sizes: ['S', 'M', 'L'],
      colors: ['Black'],
      inStock: true,
      imageUrl: ['images/reservedtshirt.png'],
    },
    {
      name: 'Pull&Bear Hoodie',
      category: 'Casual',
      brand: 'Pull&Bear',
      price: 19.9,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Grey'],
      inStock: true,
      imageUrl: ['images/pullnbearhoodie.png', 'images/hoodiegrey.png'],
    },
    {
      name: 'Zara Sweatshirt',
      category: 'Casual',
      brand: 'Zara',
      price: 19.9,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Green'],
      inStock: true,
      imageUrl: ['images/zarasweatshirtblack.png', 'images/zarasweatshirt.png'],
    },
    {
      name: 'Bershka shirt',
      category: 'Formal',
      brand: 'Bershka',
      price: 29.9,
      sizes: ['S', 'M', 'L'],
      colors: ['Blue', 'Green'],
      inStock: true,
      imageUrl: ['images/bershkashirtblue.png', 'images/bershkagreenshirt.png'],
    },
    {
      name: 'Bershka Spider-Man Long Sleeve',
      category: 'Streetwear',
      brand: 'Bershka',
      price: 29.9,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black'],
      inStock: true,
      imageUrl: ['images/blackshirtprint.png'],
    },
    {
      name: 'ACNE Studios Yoyogi 2021F Jeans',
      category: 'Streetwear',
      brand: 'ACNE Studios',
      price: 299.9,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black'],
      inStock: true,
      imageUrl: ['images/acnestudiosjeans.png'],
    },
    {
      name: 'Adidas Spezial',
      category: 'Streetwear',
      brand: 'Adidas',
      price: 79.9,
      sizes: ['40', '41', '42', '43'],
      colors: ['Grey', 'Red'],
      inStock: true,
      imageUrl: ['images/adidasspezial.png', 'images/adidasspezialred.png'],
    },
    {
      name: 'Nike Sports Jacket',
      category: 'Sport',
      brand: 'Nike',
      price: 104.95,
      sizes: ['S', 'M', 'L'],
      colors: ['Black'],
      inStock: true,
      imageUrl: ['images/nikesportsjacket.png'],
    },
    {
      name: 'Adidas Performance Dres',
      category: 'Sport',
      brand: 'Adidas',
      price: 59.9,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Green'],
      inStock: true,
      imageUrl: ['images/adidasperformancedres.png'],
    },
    {
      name: 'Puma Sports Jacket',
      category: 'Sport',
      brand: 'Puma',
      price: 50.9,
      sizes: ['S', 'M', 'L'],
      colors: ['Blue'],
      inStock: true,
      imageUrl: ['images/pumasportsjacket.png'],
    },
    {
      name: 'Puma Sports Sweatpants',
      category: 'Sport',
      brand: 'Puma',
      price: 39.9,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Grey'],
      inStock: true,
      imageUrl: ['images/pumasportspants.png'],
    },
    {
      name: 'Nike Regular Sports Pants',
      category: 'Sport',
      brand: 'Nike',
      price: 20.0,
      sizes: ['S', 'M', 'L'],
      colors: ['Red', 'Green'],
      inStock: true,
      imageUrl: [
        'images/nikeregularsportsred.png',
        'images/nikeregularsports.png',
      ],
    },
    {
      name: 'Sinsay Black Pants',
      category: 'Formal',
      brand: 'Sinsay',
      price: 29.9,
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Black'],
      inStock: true,
      imageUrl: ['images/sinsayblackpants.png'],
    },
    {
      name: 'Zara Dress Shoes',
      category: 'Formal',
      brand: 'Zara',
      price: 49.9,
      sizes: ['37', '38', '39', '40', '41'],
      colors: ['Black'],
      inStock: true,
      imageUrl: ['images/zaradressshoes.png'],
    },
    {
      name: 'Bershka Sweatpants',
      category: 'Casual',
      brand: 'Bershka',
      price: 19.9,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['White'],
      inStock: true,
      imageUrl: ['images/bershkasweatpants.png'],
    },
  ];

  for (const product of products) {
    const categoryId = categoryMap[product.category.toLowerCase()];
    if (!categoryId) {
      console.warn(`Kategorija nije pronađena za proizvod: ${product.name}`);
      continue;
    }
    await prisma.product.create({
      data: {
        name: product.name,
        description: `${product.brand} ${product.name}`,
        price: product.price,
        brand: product.brand,
        imageUrl: product.imageUrl ?? [],
        sizes: product.sizes,
        colors: product.colors,
        inStock: product.inStock,
        categoryId,
      },
    });
  }

  const users = await prisma.user.findMany();
  const allProducts = await prisma.product.findMany();

  const adminUser = users.find((u) => u.email === 'admin@mail.com')!;
  const regularUser = users.find((u) => u.email === 'user@mail.com')!;

  await prisma.order.create({
    data: {
      userId: regularUser.id,
      status: 'DELIVERED',
      total: 119.8,
      shippingAddress: 'User Poljicka 5, Split',
      billingAddress: 'User Poljicka 5, Split',
      items: {
        create: [
          {
            productId: allProducts[0].id,
            quantity: 1,
            price: allProducts[0].price,
            size: 'M',
            color: 'Black',
          },
          {
            productId: allProducts[2].id,
            quantity: 2,
            price: allProducts[2].price,
            size: 'L',
            color: 'Black',
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: regularUser.id,
      status: 'SHIPPED',
      total: 89.9,
      shippingAddress: 'User Poljicka 5, Split',
      billingAddress: 'User Poljicka 5, Split',
      items: {
        create: [
          {
            productId: allProducts[1].id,
            quantity: 1,
            price: allProducts[1].price,
            size: '44',
            color: 'Yellow',
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: adminUser.id,
      status: 'CONFIRMED',
      total: 299.9,
      shippingAddress: 'Admin Ilica 1, Zagreb',
      billingAddress: 'Admin Ilica 1, Zagreb',
      items: {
        create: [
          {
            productId: allProducts[7].id,
            quantity: 1,
            price: allProducts[7].price,
            size: 'M',
            color: 'Black',
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: regularUser.id,
      status: 'PENDING',
      total: 39.8,
      shippingAddress: 'User Poljicka 5, Split',
      billingAddress: 'User Poljicka 5, Split',
      items: {
        create: [
          {
            productId: allProducts[4].id,
            quantity: 1,
            price: allProducts[4].price,
            size: 'S',
            color: 'Black',
          },
          {
            productId: allProducts[6].id,
            quantity: 1,
            price: allProducts[6].price,
            size: 'M',
            color: 'Black',
          },
        ],
      },
    },
  });

  console.log('Seeding complete');
  console.log('Admin: admin@mail.com / admin123');
  console.log('User:  user@mail.com / user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

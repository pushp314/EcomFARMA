const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const users = [
  {
    name: 'Platform Admin',
    email: 'admin@farm.com',
    password: 'password123',
    role: 'admin',
    isApproved: true,
  },
  {
    name: 'Ramesh Singh',
    email: 'farmer@farm.com',
    password: 'password123',
    role: 'farmer',
    isApproved: true,
    farmName: 'Green Valley Organics',
    farmDescription: 'We specialize in organic vegetables grown without synthetic pesticides.',
    city: 'Pune',
    state: 'Maharashtra',
  },
  {
    name: 'Anita Desai',
    email: 'anita@farm.com',
    password: 'password123',
    role: 'farmer',
    isApproved: true,
    farmName: 'Sunrise Dairy & Apiary',
    farmDescription: 'Fresh local dairy and raw honey sourced directly from our happy cows and bees.',
    city: 'Nashik',
    state: 'Maharashtra',
  },
  {
    name: 'John Customer',
    email: 'customer@farm.com',
    password: 'password123',
    role: 'customer',
    isApproved: true,
    street: '123 MG Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  },
];

const seedDatabase = async () => {
  try {
    console.log('Clearing existing data...');
    // Delete in reverse order of constraints
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    console.log('Creating users...');
    const createdUsers = [];
    for (const u of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(u.password, salt);
      const user = await prisma.user.create({
        data: {
          ...u,
          password: hashedPassword,
        },
      });
      createdUsers.push(user);
    }

    const farmer1 = createdUsers.find(u => u.email === 'farmer@farm.com');
    const farmer2 = createdUsers.find(u => u.email === 'anita@farm.com');

    const products = [
      {
        name: 'Organic Tomatoes',
        category: 'Vegetables',
        price: 45,
        stock: 100,
        unit: 'kg',
        description: 'Freshly picked, juicy organic tomatoes perfect for curries and salads.',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80',
        farmerId: farmer1.id,
      },
      {
        name: 'Farm Fresh Potatoes',
        category: 'Vegetables',
        price: 30,
        stock: 250,
        unit: 'kg',
        description: 'Large, starchy potatoes directly sourced from our fields.',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80',
        farmerId: farmer1.id,
      },
      {
        name: 'Crunchy Carrots',
        category: 'Vegetables',
        price: 50,
        stock: 80,
        unit: 'kg',
        description: 'Sweet, vibrant orange carrots rich in Vitamin A.',
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80',
        farmerId: farmer1.id,
      },
      {
        name: 'Fresh Spinach Bundle',
        category: 'Vegetables',
        price: 25,
        stock: 150,
        unit: 'pieces',
        description: 'Dark green leafy spinach, hydro-cooled upon harvest.',
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80',
        farmerId: farmer1.id,
      },
      {
        name: 'Raw Wild Honey',
        category: 'Others',
        price: 450,
        stock: 40,
        unit: 'liters',
        description: 'Unprocessed, unfiltered wild honey collected by our forest bees.',
        image: 'https://images.unsplash.com/photo-1587049352847-4d4b1a45ab23?w=800&q=80',
        farmerId: farmer2.id,
      },
      {
        name: 'A2 Cow Ghee',
        category: 'Dairy',
        price: 850,
        stock: 25,
        unit: 'liters',
        description: 'Pure, traditional bilona A2 ghee made from grass-fed cows.',
        image: 'https://images.unsplash.com/photo-1627042633145-b780d842bac7?w=800&q=80',
        farmerId: farmer2.id,
      },
      {
        name: 'Fresh Buffalo Milk',
        category: 'Dairy',
        price: 70,
        stock: 100,
        unit: 'liters',
        description: 'Unpasteurized fresh morning buffalo milk. Boil before consuming.',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&q=80',
        farmerId: farmer2.id,
      },
      {
        name: 'Alphonso Mangoes',
        category: 'Fruits',
        price: 800,
        stock: 30,
        unit: 'dozens',
        description: 'The king of fruits! Hand-picked, naturally ripened Alphonso mangoes.',
        image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80',
        farmerId: farmer1.id,
      },
      {
        name: 'Organic Basmati Rice',
        category: 'Grains',
        price: 120,
        stock: 500,
        unit: 'kg',
        description: 'Aged for 2 years, long grain aromatic basmati rice.',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
        farmerId: farmer1.id,
      },
      {
        name: 'Turmeric Powder (Haldi)',
        category: 'Spices',
        price: 250,
        stock: 60,
        unit: 'kg',
        description: 'Freshly ground organic turmeric with high curcumin content (above 5%).',
        image: 'https://images.unsplash.com/photo-1615486171448-4fbef03f0bde?w=800&q=80',
        farmerId: farmer2.id,
      },
    ];

    console.log('Creating products...');
    for (const p of products) {
      await prisma.product.create({ data: p });
    }

    console.log('Database seeded successfully! 🌱');
    console.log('\n--- Test Accounts ---');
    console.log('Admin: admin@farm.com / password123');
    console.log('Farmer 1: farmer@farm.com / password123 (Ramesh - Vegetables/Grains)');
    console.log('Farmer 2: anita@farm.com / password123 (Anita - Dairy/Honey)');
    console.log('Customer: customer@farm.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedDatabase();

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
      {
        name: 'Organic Ginger',
        category: 'Spices',
        price: 180,
        stock: 50,
        unit: 'kg',
        description: 'Pungent, fresh organic ginger root from the Malabar coast.',
        image: 'https://images.unsplash.com/photo-1591396392050-60ca3dc39703?w=800&q=80',
        farmerId: farmer1.id,
      },
      {
        name: 'Himalayan Garlic',
        category: 'Vegetables',
        price: 320,
        stock: 30,
        unit: 'kg',
        description: 'Small, potent single-clove garlic grown in the cold Himalayan climate.',
        image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800&q=80',
        farmerId: farmer1.id,
      },
      {
        name: 'Ruby Onions',
        category: 'Vegetables',
        price: 35,
        stock: 1000,
        unit: 'kg',
        description: 'Crisp red onions perfect for salads and cooking.',
        image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=800&q=80',
        farmerId: farmer1.id,
      },
      {
        name: 'Sweet Bananas (G9)',
        category: 'Fruits',
        price: 60,
        stock: 200,
        unit: 'dozens',
        description: 'Nutritious, naturally ripened G9 variety bananas.',
        image: 'https://images.unsplash.com/photo-1571771894821-ad9961135b4e?w=800&q=80',
        farmerId: farmer1.id,
      },
      {
        name: 'Juicy Watermelon',
        category: 'Fruits',
        price: 40,
        stock: 150,
        unit: 'kg',
        description: 'Sweet, hydrating summer watermelons harvested daily.',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80',
        farmerId: farmer1.id,
      },
      {
        name: 'Whole Wheat (Sharbati)',
        category: 'Grains',
        price: 55,
        stock: 2000,
        unit: 'kg',
        description: 'Premium Sharbati wheat from the Sehore region of Madhya Pradesh.',
        image: 'https://images.unsplash.com/photo-1542749705-179ad229ae35?w=800&q=80',
        farmerId: farmer1.id,
      },
      {
        name: 'Desi Eggs (Free Range)',
        category: 'Dairy',
        price: 150,
        stock: 200,
        unit: 'dozens',
        description: 'Nutrient-rich eggs from free-range indigenous hens.',
        image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800&q=80',
        farmerId: farmer2.id,
      },
      {
        name: 'Black Peppercorns',
        category: 'Spices',
        price: 750,
        stock: 45,
        unit: 'kg',
        description: 'Sun-dried premium black pepper from Wayanad.',
        image: 'https://images.unsplash.com/photo-1532467411036-5d1296ade73f?w=800&q=80',
        farmerId: farmer2.id,
      },
      {
        name: 'Organic Cauliflower',
        category: 'Vegetables',
        price: 40,
        stock: 120,
        unit: 'pieces',
        description: 'Winter-fresh, pesticide-free white cauliflower.',
        image: 'https://images.unsplash.com/photo-1510627489930-0c1b0ba0fa14?w=800&q=80',
        farmerId: farmer1.id,
      },
      {
        name: 'Green Peas (Matar)',
        category: 'Vegetables',
        price: 60,
        stock: 300,
        unit: 'kg',
        description: 'Fresh, sweet green peas shelled and ready to cook.',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80',
        farmerId: farmer1.id,
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

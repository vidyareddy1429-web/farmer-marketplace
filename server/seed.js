const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Review = require('./models/Review');

const runSeed = async () => {
  try {
    console.log('[Seed]: Wiping old demo data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});

    console.log('[Seed]: Creating South Indian demo users (Telangana, Andhra Pradesh, Karnataka)...');
    
    // Admin
    const admin = await User.create({
      name: 'Krishi Platform Admin',
      email: 'admin@farm.com',
      password: 'password123',
      role: 'admin',
      phone: '+91 98765 00000',
      location: 'Hyderabad, Telangana',
      isApproved: true,
    });

    // Farmers in South India (Telangana, Andhra Pradesh, Karnataka)
    const farmer1 = await User.create({
      name: 'K. Rama Rao',
      email: 'farmer1@greenfields.com',
      password: 'password123',
      role: 'farmer',
      phone: '+91 98480 12345',
      location: 'Rangareddy (Near Hyderabad), Telangana',
      farmName: 'Telangana Organic Rythu Farm',
      isApproved: true,
    });

    const farmer2 = await User.create({
      name: 'Y. Nageswara Rao',
      email: 'farmer2@sunshinevalley.com',
      password: 'password123',
      role: 'farmer',
      phone: '+91 98490 23456',
      location: 'Guntur, Andhra Pradesh',
      farmName: 'Andhra Spice & Grain Rythu Kendra',
      isApproved: true,
    });

    const farmer3 = await User.create({
      name: 'M. Siddappa',
      email: 'farmer3@deccanfarms.com',
      password: 'password123',
      role: 'farmer',
      phone: '+91 98800 34567',
      location: 'Mandya (Near Bengaluru), Karnataka',
      farmName: 'Karnataka Green Dairy & Agri Farm',
      isApproved: true,
    });

    const farmer4 = await User.create({
      name: 'B. Srinivas Reddy',
      email: 'farmer4@nizamabadagri.com',
      password: 'password123',
      role: 'farmer',
      phone: '+91 98481 45678',
      location: 'Nizamabad, Telangana',
      farmName: 'Deccan Organic Turmeric & Rice Farm',
      isApproved: true,
    });

    // Customer
    const customer1 = await User.create({
      name: 'Suhasini Reddy',
      email: 'customer@freshbuy.com',
      password: 'password123',
      role: 'customer',
      phone: '+91 99000 55555',
      location: 'Banjara Hills, Hyderabad, Telangana',
      isApproved: true,
    });

    console.log('[Seed]: Creating produce with realistic South Indian Rythu Bazaar / Mandi prices in ₹...');
    
    const productsData = [
      {
        name: 'Fresh Hyderabadi Tomatoes (Desi)',
        category: 'Vegetables',
        price: 28, // Real Mandi price per kg
        quantity: 350,
        unit: 'kg',
        description: 'Naturally grown farm-fresh tomatoes harvested daily from Rangareddy fields near Hyderabad.',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600',
        location: 'Rangareddy (Near Hyderabad), Telangana',
        farmer: farmer1._id,
      },
      {
        name: 'Organic Farm Palak (Spinach)',
        category: 'Vegetables',
        price: 18, // Real Mandi price per kg
        quantity: 150,
        unit: 'kg',
        description: 'Crisp green leafy spinach grown with organic compost, free from chemical sprays.',
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=600',
        location: 'Rangareddy (Near Hyderabad), Telangana',
        farmer: farmer1._id,
      },
      {
        name: 'Kolar Fresh Red Capsicum & Carrots',
        category: 'Vegetables',
        price: 36, // Real Mandi price per kg
        quantity: 200,
        unit: 'kg',
        description: 'Fresh crunchy vegetables grown in high-altitude fertile soil of Kolar.',
        image: 'https://images.unsplash.com/photo-1598170845058-12ef4a45753b?auto=format&fit=crop&q=80&w=600',
        location: 'Kolar (Near Bengaluru), Karnataka',
        farmer: farmer3._id,
      },
      {
        name: 'Authentic Guntur Mirchi (Red Chili)',
        category: 'Spices',
        price: 190, // Real Guntur Mandi price per kg
        quantity: 250,
        unit: 'kg',
        description: 'World-famous GI-tagged spicy red chili sun-dried naturally under Guntur sunshine.',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
        location: 'Guntur, Andhra Pradesh',
        farmer: farmer2._id,
      },
      {
        name: 'Premium Kurnool Sona Masoori Rice',
        category: 'Grains',
        price: 58, // Real retail market price per kg
        quantity: 800,
        unit: 'kg',
        description: 'Aged light-grain Sona Masoori raw rice cultivated along Tungabhadra river belt.',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600',
        location: 'Kurnool, Andhra Pradesh',
        farmer: farmer2._id,
      },
      {
        name: 'Nizamabad Organic Turmeric (Haldi)',
        category: 'Spices',
        price: 145, // Real Nizamabad Mandi price per kg
        quantity: 180,
        unit: 'kg',
        description: 'High curcumin content golden turmeric rhizomes ground directly on the farm.',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
        location: 'Nizamabad, Telangana',
        farmer: farmer4._id,
      },
      {
        name: 'Pure Mandi Cow Milk (A2)',
        category: 'Dairy',
        price: 52, // Real price per liter
        quantity: 200,
        unit: 'liter',
        description: 'Pure, chilled grass-fed cow milk supplied direct to households daily.',
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=600',
        location: 'Mandya, Karnataka',
        farmer: farmer3._id,
      },
      {
        name: 'Fresh Country Chicken Eggs (Natu Kodi Guddu)',
        category: 'Dairy',
        price: 95, // Real price per dozen (12 eggs)
        quantity: 100,
        unit: 'dozen',
        description: 'Nutritious free-range country hen eggs collected fresh every morning.',
        image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=600',
        location: 'Chittoor, Andhra Pradesh',
        farmer: farmer2._id,
      },
      {
        name: 'Vijayawada Banganapalle Sweet Mangoes',
        category: 'Fruits',
        price: 85, // Real seasonal market price per kg
        quantity: 300,
        unit: 'kg',
        description: 'Naturally tree-ripened famous Banganapalle sweet mangoes without carbide.',
        image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=600',
        location: 'Vijayawada (Krishna District), Andhra Pradesh',
        farmer: farmer2._id,
      },
      {
        name: 'Warangal Sweet Guava (Amrood)',
        category: 'Fruits',
        price: 45, // Real Mandi price per kg
        quantity: 150,
        unit: 'kg',
        description: 'Crisp, sweet white-fleshed fresh guavas packed with Vitamin C.',
        image: 'https://images.unsplash.com/photo-1536511135885-300d8f990666?auto=format&fit=crop&q=80&w=600',
        location: 'Warangal, Telangana',
        farmer: farmer4._id,
      },
    ];

    const insertedProducts = await Product.insertMany(productsData);

    console.log('[Seed]: Creating sample order in Hyderabad...');
    const prod1 = insertedProducts[0]; // Hyderabadi Tomatoes
    const prod5 = insertedProducts[4]; // Sona Masoori Rice

    await Order.create({
      customer: customer1._id,
      items: [
        {
          product: prod1._id,
          farmer: prod1.farmer,
          name: prod1.name,
          qty: 5,
          price: prod1.price,
          unit: prod1.unit,
          image: prod1.image,
        },
        {
          product: prod5._id,
          farmer: prod5.farmer,
          name: prod5.name,
          qty: 10,
          price: prod5.price,
          unit: prod5.unit,
          image: prod5.image,
        },
      ],
      totalAmount: prod1.price * 5 + prod5.price * 10,
      status: 'accepted',
      address: {
        street: 'Plot No. 42, Road No. 12, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        zip: '500034',
        phone: '+91 99000 55555',
      },
      paymentMethod: 'Cash on Delivery',
    });

    console.log('[Seed]: Creating sample customer review...');
    await Review.create({
      product: prod1._id,
      customer: customer1._id,
      rating: 5,
      comment: 'Very fresh tomatoes delivered directly from Rangareddy farm to my doorstep in Hyderabad!',
    });

    console.log('[Seed]: Telangana, Andhra Pradesh & Karnataka market database seeding successfully completed!');
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
};

if (require.main === module) {
  const connectDB = require('./config/db');
  connectDB().then(async () => {
    await runSeed();
    process.exit(0);
  });
}

module.exports = { runSeed };

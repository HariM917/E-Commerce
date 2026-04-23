const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./config/db');

dotenv.config();

const users = [
  {
    name: 'Admin',
    email: '',
    password: '',
    role: 'admin',
  },
  {
    name: '',
    email: '',
    password: '',
    role: 'user',
  },
];

const products = [
  {
    name: 'Premium AirPods Pro',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: 'Active Noise Cancellation blocks outside noise, so you can immerse yourself in music.',
    category: 'Electronics',
    price: 249.99,
    stock: 10,
  },
  {
    name: 'iPhone 14 Pro',
    image: 'https://images.unsplash.com/photo-1663465374464-90ff66ee9fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: 'A magical new way to interact with iPhone. Groundbreaking safety features designed to save lives.',
    category: 'Electronics',
    price: 999.99,
    stock: 7,
  },
  {
    name: 'Sony WH-1000XM5',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    description: 'Industry leading noise canceling headphones with Auto Noise Canceling Optimizer.',
    category: 'Electronics',
    price: 398.00,
    stock: 5,
  },
];

const importData = async () => {
  try {
    await connectDB();
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0]._id;

    await Product.create(products);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const seedDatabase = async () => {
    try {
        const maskedUri = process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@');
        console.log('Connecting to:', maskedUri);
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('Connected to MongoDB for seeding...');

        // 1. Create Admin User
        await User.deleteMany({ role: 'admin' });
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Admin user created: admin@example.com / admin123');

        // 2. Parse CSV and Seed Products
        const products = [];
        const csvFilePath = path.join(__dirname, '..', 'amazon.csv');

        if (!fs.existsSync(csvFilePath)) {
            console.error('amazon.csv not found at:', csvFilePath);
            process.exit(1);
        }

        console.log('Starting CSV parsing...');

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                // Clean price: ₹399 -> 399, ₹1,099 -> 1099
                let priceStr = row.discounted_price || row.actual_price || '0';
                const cleanPrice = parseFloat(priceStr.replace(/[₹,]/g, '')) || 0;

                products.push({
                    name: row.product_name,
                    description: row.about_product || 'No description available.',
                    price: cleanPrice,
                    image: row.img_link,
                    category: row.category ? row.category.split('|')[0] : 'General',
                    stock: Math.floor(Math.random() * 100) + 10 // Random stock between 10-100
                });
            })
            .on('end', async () => {
                console.log(`Parsed ${products.length} products.`);
                if (products.length > 0) {
                    console.log('Sample Product:', JSON.stringify(products[0], null, 2));
                }
                console.log('Inserting into database...');
                
                await Product.deleteMany({});
                
                // Insert in chunks if the file is massive, but 1.4k is fine for insertMany
                await Product.insertMany(products);
                
                console.log('Database Seeded Successfully with Amazon Products!');
                mongoose.connection.close();
                process.exit(0);
            })
            .on('error', (err) => {
                console.error('Error reading CSV:', err);
                process.exit(1);
            });

    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedDatabase();

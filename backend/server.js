const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Product = require('./models/Product');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Health Check Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'live', version: 'v2', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Temporary Seeding Route
app.get('/api/seed', async (req, res) => {
    try {
        const products = [];
        const csvFilePath = path.join(__dirname, 'amazon.csv');

        if (!fs.existsSync(csvFilePath)) {
            return res.status(404).json({ message: 'amazon.csv not found' });
        }

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                let priceStr = row.discounted_price || row.actual_price || '0';
                const cleanPrice = parseFloat(priceStr.replace(/[₹,]/g, '')) || 0;

                products.push({
                    name: row.product_name,
                    description: row.about_product || 'No description available.',
                    price: cleanPrice,
                    image: row.img_link,
                    category: row.category ? row.category.split('|')[0] : 'General',
                    stock: Math.floor(Math.random() * 100) + 10
                });
            })
            .on('end', async () => {
                await Product.deleteMany({});
                await Product.insertMany(products);
                
                // Ensure an admin exists
                const adminExists = await User.findOne({ role: 'admin' });
                if (!adminExists) {
                    const hashedPassword = await bcrypt.hash('admin123', 10);
                    await User.create({
                        name: 'Admin User',
                        email: 'admin@example.com',
                        password: hashedPassword,
                        role: 'admin'
                    });
                }

                res.json({ message: `Successfully seeded ${products.length} products and ensured admin exists.` });
            })
            .on('error', (err) => {
                res.status(500).json({ error: err.message });
            });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('API is running... (v2)');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

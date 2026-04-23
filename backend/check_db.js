const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const countProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await Product.countDocuments();
        console.log(`Product Count: ${count}`);
        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

countProducts();

const dns = require('dns');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Try to use Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const testConnection = async () => {
    try {
        console.log('Attempting connection with custom DNS (8.8.8.8)...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('SUCCESS: Connected to MongoDB!');
        await mongoose.connection.close();
    } catch (err) {
        console.error('FAILED with custom DNS:', err.message);
        if (err.message.includes('querySrv')) {
            console.log('Observation: SRV still fails. Proceeding to fallback plan...');
        }
    }
};

testConnection();

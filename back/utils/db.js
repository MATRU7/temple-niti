import mongoose from "mongoose";
import dns from 'dns';

dns.setServers(['8.8.8.8']);

const DB_URL = process.env.DB_URL;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

async function connectToDB(retries = 0) {
    try {
        await mongoose.connect(DB_URL, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
    } catch (error) {
        console.error(`❌  Database connection error: ${error.message}`);
        if (retries < MAX_RETRIES) {
            console.log(`🔄  Retrying connection in ${RETRY_DELAY_MS / 1000}s... (Attempt ${retries + 1}/${MAX_RETRIES})`);
            setTimeout(() => connectToDB(retries + 1), RETRY_DELAY_MS);
        } else {
            console.error('💥  Max retries reached. Exiting...');
            process.exit(1);
        }
    }
}

// ── Connection event listeners ────────────────────────────────────────────────
mongoose.connection.on('connected', () => {
    console.log('✅  MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
    console.error(`❌  MongoDB connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️   MongoDB disconnected. Attempting reconnect...');
});

mongoose.connection.on('reconnected', () => {
    console.log('🔄  MongoDB reconnected');
});

export default connectToDB;
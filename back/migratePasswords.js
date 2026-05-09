/**
 * ONE-TIME PASSWORD MIGRATION SCRIPT
 * ─────────────────────────────────────────────────────────────────────────────
 * Run this ONCE after deploying the security upgrade to re-hash all existing
 * plain-text passwords in the database.
 *
 * Usage: node migratePasswords.js
 * ─────────────────────────────────────────────────────────────────────────────
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

async function migrate() {
    console.log('\n🔐 Password Migration Script Starting...\n');

    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('✅  Connected to MongoDB\n');

        // Access raw collection to avoid triggering pre-save hooks again
        const collection = mongoose.connection.collection('users');
        const users = await collection.find({}).toArray();

        console.log(`📋  Found ${users.length} user(s) to process.\n`);

        let migrated = 0;
        let skipped = 0;

        for (const user of users) {
            const pwd = user.password;

            // Skip if already bcrypt hashed (bcrypt hashes start with $2b$ or $2a$)
            if (pwd && (pwd.startsWith('$2b$') || pwd.startsWith('$2a$'))) {
                console.log(`⏭️   Skipping [${user.email}] — already hashed.`);
                skipped++;
                continue;
            }

            if (!pwd) {
                console.log(`⚠️   Skipping [${user.email}] — no password found.`);
                skipped++;
                continue;
            }

            // Hash the plain-text password
            const hashed = await bcrypt.hash(pwd, SALT_ROUNDS);
            await collection.updateOne(
                { _id: user._id },
                { $set: { password: hashed } }
            );

            console.log(`✅  Migrated [${user.email}]`);
            migrated++;
        }

        console.log(`\n─────────────────────────────`);
        console.log(`✅  Migration complete!`);
        console.log(`   Migrated : ${migrated} user(s)`);
        console.log(`   Skipped  : ${skipped} user(s)`);
        console.log(`─────────────────────────────\n`);

    } catch (error) {
        console.error('❌  Migration failed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌  Disconnected from MongoDB. Exiting.\n');
        process.exit(0);
    }
}

migrate();

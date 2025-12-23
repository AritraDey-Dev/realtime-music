import { runImport } from "./scripts/importSongs.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const INTERVAL_MS = 1000 * 60 * 60; // Run every 1 hour
// const INTERVAL_MS = 1000 * 10; // Run every 10 seconds (for testing)

console.log("🕰️  Starting Music Import Cron Service...");
console.log(`📅 Schedule: Every ${INTERVAL_MS / 1000 / 60} minutes`);

const startCron = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("✅ Connected to DB for Cron Service");

        // Run immediately on start
        await runImport();

        setInterval(async () => {
            console.log("\n⏰ Triggering scheduled import...");
            await runImport();
        }, INTERVAL_MS);

    } catch (error) {
        console.error("❌ Cron Service Error:", error);
    }
};

startCron();

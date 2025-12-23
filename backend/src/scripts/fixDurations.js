import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import dotenv from "dotenv";

dotenv.config();

const fixDurations = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("✅ Connected to MongoDB");

        // Find songs with iTunes preview URLs (they usually contain 'audio-ssl.itunes.apple.com')
        const songs = await Song.find({ audioUrl: { $regex: 'itunes.apple.com' } });
        console.log(`Found ${songs.length} iTunes songs.`);

        let updatedCount = 0;
        for (const song of songs) {
            if (song.duration !== 30) {
                song.duration = 30;
                await song.save();
                updatedCount++;
            }
        }

        console.log(`✅ Updated ${updatedCount} songs to 30s duration.`);

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

fixDurations();

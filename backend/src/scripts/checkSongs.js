import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import dotenv from "dotenv";

dotenv.config();

const checkSongs = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("✅ Connected to MongoDB");

        const songs = await Song.find().sort({ createdAt: -1 }).limit(5);
        console.log("Last 5 songs:");
        songs.forEach(s => {
            console.log(`- Title: ${s.title}`);
            console.log(`  Artist: ${s.artist}`);
            console.log(`  Duration: ${s.duration}`);
            console.log(`  AudioURL: ${s.audioUrl}`);
            console.log(`  ImageURL: ${s.imageUrl}`);
            console.log("---");
        });

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

checkSongs();

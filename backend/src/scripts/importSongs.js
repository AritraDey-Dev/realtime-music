import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import dotenv from "dotenv";

dotenv.config();

// Fetch 100 songs from iTunes Search API with randomization
const fetchSongsFromExternalSource = async () => {
    console.log("📡 Connecting to iTunes Search API...");
    
    const keywords = ["pop", "rock", "hip hop", "jazz", "electronic", "classical", "country", "reggae", "indie", "dance", "soul", "lofi", "chill", "party", "focus", "hits", "top", "viral", "trending", "2024", "2025"];
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    const randomOffset = Math.floor(Math.random() * 200);

    try {
        const url = `https://itunes.apple.com/search?term=${randomKeyword}&limit=100&entity=song&offset=${randomOffset}`;
        console.log(`🔗 Fetching ${randomKeyword} tracks (offset: ${randomOffset}) from: ${url}`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            console.log("ℹ️ No tracks found in the response.");
            return [];
        }

        const validSongs = data.results.filter(track => track.previewUrl && track.artworkUrl100).map(track => ({
            title: track.trackName,
            artist: track.artistName,
            // Get higher resolution artwork
            imageUrl: track.artworkUrl100.replace('100x100bb', '600x600bb'),
            audioUrl: track.previewUrl,
            duration: 30, // iTunes previews are 30 seconds
            lyrics: `Lyrics for ${track.trackName} by ${track.artistName} are coming soon! Enjoy this preview.`,
        }));

        return validSongs;
    } catch (error) {
        console.error("❌ Error fetching from iTunes:", error);
        return [];
    }
};

export const runImport = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.DB_URL);
            console.log("✅ Connected to MongoDB");
        }

        const newSongs = await fetchSongsFromExternalSource();
        console.log(`📥 Fetched ${newSongs.length} valid songs from iTunes.`);

        if (newSongs.length === 0) {
            console.log("⚠️ No songs to import.");
            return;
        }

        let addedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const song of newSongs) {
            try {
                // Check if song already exists by title and artist to avoid duplicates
                const exists = await Song.findOne({ title: song.title, artist: song.artist });
                if (!exists) {
                    await Song.create(song);
                    // console.log(`✨ Added: ${song.title} by ${song.artist}`);
                    addedCount++;
                } else {
                    skippedCount++;
                }
            } catch (err) {
                console.error(`❌ Failed to add song ${song.title}:`, err.message);
                errorCount++;
            }
        }

        console.log(`🎉 Import finished.`);
        console.log(`✨ Added: ${addedCount} new songs`);
        console.log(`⏭️  Skipped: ${skippedCount} existing songs`);
    } catch (error) {
        console.error("❌ Import failed:", error);
    }
};

// Allow running directly from command line
if (process.argv[1] === import.meta.url.substring(7) || process.argv[1]?.endsWith('importSongs.js')) {
    (async () => {
        await runImport();
        await mongoose.disconnect();
    })();
}

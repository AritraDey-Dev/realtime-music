import { GoogleGenerativeAI } from "@google/generative-ai";
import { Song } from "../models/song.model.js";
import { Playlist } from "../models/playlist.model.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generatePlaylist = async (req, res, next) => {
    try {
        const { prompt } = req.body;
        const currentUserId = req.auth.userId;

        if (!process.env.GEMINI_API_KEY) {
            console.error("Error: GEMINI_API_KEY is missing in environment variables.");
            return res.status(500).json({ message: "Server configuration error: Missing API Key" });
        }

        // 1. Fetch all songs to give context to the AI
        const allSongs = await Song.find({}).select('title artist album imageUrl duration audioUrl');

        const songList = allSongs.map(song =>
            `${song._id}: "${song.title}" by ${song.artist} (${song.album || 'Single'})`
        ).join('\n');

        // 2. Prompt Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const systemPrompt = `
            You are a helpful and cool AI DJ assistant. You help users discover music, answer questions, and create playlists.
            
            Here is the list of available songs in the database:
            ${songList}

            User's request: "${prompt}"

            Analyze the request.
            1. If the user explicitly asks to CREATE a playlist (e.g., "make a playlist", "create a mix"), return a JSON object with this structure:
            {
                "type": "playlist",
                "playlistName": "Creative Playlist Title",
                "description": "Short description of the vibe",
                "songIds": ["id1", "id2", ...] (Select 5-15 IDs from the provided list that match the vibe)
            }

            2. If the user is just chatting, asking for recommendations without explicit creation, or asking general questions, return:
            {
                "type": "chat",
                "content": "Your helpful and friendly response here. You can mention songs from the list by name."
            }

            Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.
        `;

        const result = await model.generateContent(systemPrompt);
        const response = result.response;
        let text = response.text();

        console.log("Gemini Raw Response:", text);

        // Clean up markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // Try to find JSON start and end if there's extra text
        const jsonStartIndex = text.indexOf('{');
        const jsonEndIndex = text.lastIndexOf('}');
        if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
            text = text.substring(jsonStartIndex, jsonEndIndex + 1);
        }

        let aiResponse;
        try {
            aiResponse = JSON.parse(text);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Failed Text:", text);
            return res.status(500).json({ message: "AI response format error" });
        }

        // Handle different response types
        if (aiResponse.type === 'playlist') {
            const playlist = await Playlist.create({
                title: aiResponse.playlistName,
                description: aiResponse.description,
                songs: aiResponse.songIds,
                clerkId: currentUserId,
                imageUrl: '/music_app.png',
                isPublic: true
            });

            return res.status(201).json({ 
                result: {
                    type: 'playlist',
                    playlistId: playlist._id,
                    playlistName: playlist.title,
                    message: `Cool! I've created a playlist called "${playlist.title}" for you.`
                }
            });
        } else {
            // Chat response
            return res.status(200).json({ 
                result: {
                    type: 'chat',
                    message: aiResponse.content
                }
            });
        }

    } catch (error) {
        console.error('Error in AI interaction:', error);
        res.status(500).json({ message: 'Failed to process AI request' });
    }
};

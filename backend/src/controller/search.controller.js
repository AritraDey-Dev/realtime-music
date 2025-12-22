import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { User } from "../models/user.model.js";

export const search = async (req, res, next) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const [songs, albums, users] = await Promise.all([
            Song.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { artist: { $regex: query, $options: 'i' } },
                ]
            }).limit(10),
            Album.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { artist: { $regex: query, $options: 'i' } },
                ]
            }).limit(10),
            User.find({
                $or: [
                    { fullName: { $regex: query, $options: 'i' } },
                    { username: { $regex: query, $options: 'i' } },
                ]
            }).limit(10)
        ]);

        res.status(200).json({ songs, albums, users });
    } catch (error) {
        console.error('error in global search', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}

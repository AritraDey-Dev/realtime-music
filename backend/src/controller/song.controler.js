import {Song} from '../models/song.model.js';

export const getAllSongs = async (req, res, next) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 });
        res.status(200).json({ songs });

    } catch (error) {
        console.error('error in getting all songs', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}

export const getFeaturedSongs = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            {
                $sample: { size: 6 },
            }, {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            },
        ]);
        res.status(200).json({ songs });
    } catch (error) {
        console.error('error in getting featured songs', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}



export const getMadeForYouSongs = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            {
                $sample: { size: 4 },
            }, {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            },
        ]);
        res.status(200).json({ songs });
    } catch (error) {
        console.error('error in getting featured songs', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}

export const getTrendingSongs = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            {
                $sample: { size: 4 },
            }, {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            },
        ]);
        res.status(200).json({ songs });
    } catch (error) {
        console.error('error in getting featured songs', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}

export const searchSongs = async (req, res, next) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const songs = await Song.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { artist: { $regex: query, $options: 'i' } },
            ]
        }).limit(10);

        res.status(200).json({ songs });
    } catch (error) {
        console.error('error in searching songs', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}
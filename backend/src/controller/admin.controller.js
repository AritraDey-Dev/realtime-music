import { Song } from '../models/song.model.js';
import { Album } from '../models/album.model.js';
import cloudinary from 'cloudinary';

export const getAdmin = (req, res) => {
    res.send('admin route with get method');
};

const uploadToCloudinary = (file) => {
try {
        const  result= cloudinary.uploader.upload(file.tempFilePath, {
            resource_rype: 'auto',
        });
        return result.secure_url;
} catch (error) {
        console.error('error in uploading to cloudinary', error);
        throw new Error(error);
    }
    
}

export const createSong = async (req, res,next) => {
    try {
        if (!req.files || !req.files.audiofile || !req.files.imageFile) {
            return res.status(400).json({ message: 'Missing files' });
        }
        const { title, artist, albumId, duration } = req.body;
        const imageFile = req.files.imageFile;
        const audioFile = req.files.audiofile;

        const audioUrl=uploadToCloudinary(audioFile);
        const imageUrl=uploadToCloudinary(imageFile);

        const song = new Song({
            title,
            artist,
            imageUrl: imageFile.location,
            audioUrl: audioFile.location,
            duration,
            albumId: albumId || null
        });
        await song.save();
        if (albumId) {
            const album = await Album.findByIdAndUpdate(albumId, { $push: { songs: song._id } });
            album.songs.push(song._id);
            await album.save();
        }
        res.status(200).json({ message: 'Song created successfully', song });

    } catch (error) {
        console.error("error in creaty song", error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);

    }
};
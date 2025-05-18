import { Playlist } from "../models/playlist.model.js";


export const createPlaylist = async (req, res, next) => {
    try {
        const currentUserId = req.auth.userId;
        const { title, description, songs } = req.body;
        const playlist = await Playlist.create({
            title,
            description,
            songs,
            clerkId: currentUserId,
        });
        res.status(201).json({ playlist });
    } catch (error) {
        console.error('error in creating playlist', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}


export const getAllPlaylists = async (req, res, next) => {
    try {
        const currentUserId = req.auth.userId;
        const playlists = await Playlist.find({ clerkId: currentUserId }).populate('songs');
        res.status(200).json({ playlists });

    } catch (error) {
        console.error('error in getting all playlists', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}

export const getPlaylistById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const playlist = await Playlist.findById(id).populate('songs');
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.status(200).json({ playlist });
    } catch (error) {
        console.error('error in getting playlist by id', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}

export const addSongToPlaylist = async (req, res, next) => {
    try {
        const { playlistId, songId } = req.body;
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        playlist.songs.push(songId);
        await playlist.save();
        res.status(200).json({ message: 'Song added to playlist' });
    } catch (error) {
        console.error('error in adding song to playlist', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}
export const removeSongFromPlaylist = async (req, res, next) => {
    try {
        const { playlistId, songId } = req.body;
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        playlist.songs = playlist.songs.filter((song) => song.toString() !== songId);
        await playlist.save();
        res.status(200).json({ message: 'Song removed from playlist' });
    } catch (error) {
        console.error('error in removing song from playlist', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}

export const deletePlaylist=async(req,res,next)=>{
    const {id}=req.params;
    try {
        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        await playlist.delete();
        res.status(200).json({ message: 'Playlist deleted' });
    } catch (error) {
        console.error('error in deleting playlist', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}
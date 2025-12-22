import { Playlist } from "../models/playlist.model.js";


export const createPlaylist = async (req, res, next) => {
    try {
        const currentUserId = req.auth.userId;
        const  count = await Playlist.countDocuments({ clerkId: currentUserId });
        const { title, description, songs,imageUrl, isPublic } = req.body;
        const playlist = await Playlist.create({
            title:title ||`Playlist ${count + 1}`,
            description: description || '',
            imageUrl: imageUrl ||'/music_app.png',
            songs:songs || [],
            isPublic: isPublic !== undefined ? isPublic : true,
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
        const currentUserId = req.auth.userId;
        const playlist = await Playlist.findOne({ _id: playlistId, clerkId: currentUserId });
    
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
        const currentUserId = req.auth.userId;
        const playlist = await Playlist.findOne({ _id: playlistId, clerkId: currentUserId });
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        
        const songIndex = playlist.songs.indexOf(songId);
        if (songIndex === -1) {
            return res.status(404).json({ message: 'Song not found in playlist' });
        }
        playlist.songs.splice(songIndex, 1);
        await playlist.save();
        res.status(200).json({ message: 'Song removed from playlist' });
    } catch (error) {
        console.error('error in removing song from playlist', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}

export const deletePlaylist=async(req,res,next)=>{
    const currentUserId = req.auth.userId;
    const {id}=req.params;
    try {
        const playlist = await Playlist.findOne({ clerkId: currentUserId, _id: id });
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        await Playlist.deleteOne({ clerkId: currentUserId, _id: id });
        res.status(200).json({ message: 'Playlist deleted successfully' });

    } catch (error) {
        console.error('error in deleting playlist', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}

export const getSongsInPlaylist=async(req,res,next)=>{

    const {id}=req.params;
    const currentUserId = req.auth.userId;
    try {
        const playlist = await Playlist.findOne({ clerkId: currentUserId, _id: id }).populate('songs');
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.status(200).json({ songs: playlist.songs });
    } catch (error) {
        console.error('error in getting songs in playlist', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }

}

export const editPlaylist = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, isPublic } = req.body;
        const currentUserId = req.auth.userId;

        const playlist = await Playlist.findOne({ _id: id, clerkId: currentUserId });
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        if (title) playlist.title = title;
        if (description) playlist.description = description;
        if (isPublic !== undefined) playlist.isPublic = isPublic;

        await playlist.save();
        res.status(200).json({ playlist });
    } catch (error) {
        console.error('error in editing playlist', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}
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

export const deleteSong = async (req,res,next)=>{
    try{
        const {id}=req.params;
        const song=await Song.findById(id);
        if(!song){
            return res.status(404).json({message:'Song not found'});
        }
        if(song.albumId){
            await Album.findByIdAndUpdate(song.albumId,{
                $pull:{songs:song._id},
            });
        }
        await Song.findByIdAndDelete(id);
        res.status(200).json({message:'Song deleted successfully'});
    }
    catch(error){
        console.error('error in deleting song',error);
        res.status(500).json({message:'Internal server error'});
        next(error);
    }
}

export const createAlbum=async (req,res,next)=>{
    try{
        const {title,artist,releaseYear}=req.body;
        const imageFile=req.files;
        const imageUrl=uploadToCloudinary(imageFile);
        const album=new Album({
            title,
            artist,
            releaseYear,
            imageUrl,
        });
        await album.save();
        res.status(200).json({message:'Album created successfully',album});
    }catch(error){
        console.error('error in creating album',error);
        res.status(500).json({message:'Internal server error'});
        next(error);
    }
}

export const deleteAlbum=async (req,res,next)=>{
    try{
        const {id}=req.params;
       await Song.deleteMany({albumId:id});
         await Album.findByIdAndDelete(id);
        res.status(200).json({message:'Album deleted successfully'});
    }

    catch(error){
        console.error('error in deleting album',error);
        res.status(500).json({message:'Internal server error'});
        next(error);
    }
}

export const checkAdmin=async (req,res,next)=>{
    try {
        res.status(200).json({isAdmin:true});
    } catch (error) {
        
    }
}
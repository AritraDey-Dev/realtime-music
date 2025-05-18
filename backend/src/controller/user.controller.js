import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js"

export const getAllUsers = async (req, res,next) => {
    try {
        const currentUserId = req.auth.userId;
        const users=await User.find({clerkId:{$ne:currentUserId}});
        res.status(200).json({users});

    } catch (error) {
        console.error('error in getting all users',error);
        res.status(500).json({message:'Internal server error'});
        next(error);
    }
}

export const getMessages=async(req,res,next)=>{
	try {
		const myId = req.auth.userId;
		const { userId } = req.params;

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		next(error);
	}

}

export const getLikedSongs=async(req,res,next)=>{
const {id} = req.params;
	try {
		const user = await User.findById(id).populate('likedSongs');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json({ likedSongs: user.likedSongs });
	} catch (error) {
		console.error('error in getting liked songs', error);
		res.status(500).json({ message: 'Internal server error' });
		next(error);
	}

}

export const getPlaylists=async(req,res,next)=>{
	const {id} = req.params;
	try {
		const user = await User.findById(id).populate('playlists');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json({ playlists: user.playlists });
	}
	catch (error) {
		console.error('error in getting playlists', error);
		res.status(500).json({ message: 'Internal server error' });
		next(error);
	}
}


export const likeSong = async (req, res, next) => {
    const { id } = req.params;
    const clerkUserId = req.auth.userId;

    try {
        const song = await Song.findById(id);
        if (!song) {
            return res.status(404).json({ message: 'Song not found' });
        }

        const user = await User.findOne({ clerkId: clerkUserId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isLiked = user.likedSongs.some(
            (songId) => songId.toString() === id
        );

        if (isLiked) {
            // Unlike
            user.likedSongs = user.likedSongs.filter(
                (songId) => songId.toString() !== id
            );
            song.likes = Math.max(0, song.likes - 1); // Prevent negative count
            await Promise.all([user.save(), song.save()]);
            return res.status(200).json({ message: 'Song unliked' });
        } else {
            // Like
            user.likedSongs.push(id);
            song.likes += 1;
            await Promise.all([user.save(), song.save()]);
            return res.status(200).json({ message: 'Song liked' });
        }
    } catch (error) {
        console.error('Error in liking song:', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
};

export const friendsRequest=async(req,res,next)=>{
	try {
		const {id}=req.params;
		const user=await User.findById(id);
		if(!user){
			return res.status(404).json({message:'User not found'});
		}
		const {friendId}=req.body;
		const friend=await User.findById(friendId);
		if(!friend){
			return res.status(404).json({message:'Friend not found'});
		}
		user.friends.push(friendId);
		friend.friends.push(id);
		await Promise.all([user.save(),friend.save()]);
		res.status(200).json({message:'Friend request sent'});
	} catch (error) {
		console.error('error in friends request',error);
		res.status(500).json({message:'Internal server error'});
		next(error);
	}
}


import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js"
import { Playlist } from "../models/playlist.model.js";

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
const id=req.auth.userId;
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
	console.log('clerkUserId',clerkUserId);

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
    song.likes = Math.max(0, song.likes - 1);
    await Promise.all([user.save(), song.save()]);
    return res.status(200).json({ liked: false, message: 'Song unliked' });
} else {
    // Like
    user.likedSongs.push(id);
    song.likes += 1;
    await Promise.all([user.save(), song.save()]);
    return res.status(200).json({ liked: true, message: 'Song liked' });
}

    } catch (error) {
        console.error('Error in liking song:', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
};

export const sendFriendRequest = async (req, res, next) => {
    try {
        const { targetUserId } = req.params;
        const currentClerkId = req.auth.userId;

        const currentUser = await User.findOne({ clerkId: currentClerkId });
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (currentUser._id.toString() === targetUserId) {
            return res.status(400).json({ message: 'Cannot send friend request to yourself' });
        }

        // Check if already friends or request pending
        const existingRequest = targetUser.friendRequests.find(
            (req) => req.senderId.toString() === currentUser._id.toString() && req.status === 'pending'
        );

        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        const alreadyFriends = currentUser.friends.includes(targetUserId);
        if (alreadyFriends) {
            return res.status(400).json({ message: 'Already friends' });
        }

        targetUser.friendRequests.push({ senderId: currentUser._id });
        await targetUser.save();

        res.status(200).json({ message: 'Friend request sent' });
    } catch (error) {
        console.error('error in sending friend request', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
};

export const acceptFriendRequest = async (req, res, next) => {
    try {
        const { requesterId } = req.body;
        const currentClerkId = req.auth.userId;

        const currentUser = await User.findOne({ clerkId: currentClerkId });
        const requester = await User.findById(requesterId);

        if (!currentUser || !requester) {
            return res.status(404).json({ message: 'User not found' });
        }

        const request = currentUser.friendRequests.find(
            (req) => req.senderId.toString() === requesterId && req.status === 'pending'
        );

        if (!request) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        request.status = 'accepted';
        currentUser.friends.push(requesterId);
        requester.friends.push(currentUser._id);

        await Promise.all([currentUser.save(), requester.save()]);

        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        console.error('error in accepting friend request', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
};

export const rejectFriendRequest = async (req, res, next) => {
    try {
        const { requesterId } = req.body;
        const currentClerkId = req.auth.userId;

        const currentUser = await User.findOne({ clerkId: currentClerkId });

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const request = currentUser.friendRequests.find(
            (req) => req.senderId.toString() === requesterId && req.status === 'pending'
        );

        if (!request) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        request.status = 'rejected';
        await currentUser.save();

        res.status(200).json({ message: 'Friend request rejected' });
    } catch (error) {
        console.error('error in rejecting friend request', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
};

export const followUser = async (req, res, next) => {
    try {
        const { targetUserId } = req.params;
        const currentClerkId = req.auth.userId;

        const currentUser = await User.findOne({ clerkId: currentClerkId });
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (currentUser.following.includes(targetUserId)) {
            return res.status(400).json({ message: 'Already following' });
        }

        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUser._id);

        await Promise.all([currentUser.save(), targetUser.save()]);

        res.status(200).json({ message: 'User followed' });
    } catch (error) {
        console.error('error in following user', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
};

export const unfollowUser = async (req, res, next) => {
    try {
        const { targetUserId } = req.params;
        const currentClerkId = req.auth.userId;

        const currentUser = await User.findOne({ clerkId: currentClerkId });
        const targetUser = await User.findById(targetUserId);

        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
        targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUser._id.toString());

        await Promise.all([currentUser.save(), targetUser.save()]);

        res.status(200).json({ message: 'User unfollowed' });
    } catch (error) {
        console.error('error in unfollowing user', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
};

export const getFriendRequests = async (req, res, next) => {
    try {
        const currentClerkId = req.auth.userId;
        const currentUser = await User.findOne({ clerkId: currentClerkId }).populate('friendRequests.senderId');

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const pendingRequests = currentUser.friendRequests.filter(req => req.status === 'pending');
        res.status(200).json(pendingRequests);
    } catch (error) {
        console.error('error in getting friend requests', error);
        res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
};

export const getUserProfile = async (req, res, next) => {
	const { clerkId } = req.params;
	try {
		const user = await User.findOne({ clerkId }).populate('likedSongs');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

        // Fetch playlists manually since they might not be linked in the user document
        const playlists = await Playlist.find({ clerkId });
        
        const userObj = user.toObject();
        userObj.playlists = playlists;

		res.status(200).json(userObj);
	} catch (error) {
		console.error('error in getting user profile', error);
		res.status(500).json({ message: 'Internal server error' });
		next(error);
	}
};


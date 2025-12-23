import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
fullName: {
    type: String,
    required: true,
},
imageUrl: {
    type: String,
    required: true,
},
clerkId: {
    type: String,
    required: true,
    unique: true,
},
likedSongs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
}],
playlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist',
}],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    friendRequests: [{
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    }],
},{timestamps: true});

export const User = mongoose.model('User', userSchema);
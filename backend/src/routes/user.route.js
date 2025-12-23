import { Router } from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { 
    sendFriendRequest, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    followUser, 
    unfollowUser, 
    getFriendRequests,
    getAllUsers, 
    getLikedSongs, 
    getPlaylists, 
    likeSong, 
    getUserProfile 
} from '../controller/user.controller.js';
import { getMessages } from '../controller/user.controller.js';
const router = Router();

router.get('/',protectedRoute,getAllUsers);
router.get("/messages/:userId", protectedRoute, getMessages);
router.get("/likedSongs", protectedRoute, getLikedSongs);
router.get("/playlists/:id", protectedRoute, getPlaylists);
router.get("/profile/:clerkId", protectedRoute, getUserProfile);
router.post('/:id', protectedRoute, likeSong);

// Social Routes
router.post('/request/accept', protectedRoute, acceptFriendRequest);
router.post('/request/reject', protectedRoute, rejectFriendRequest);
router.post('/request/:targetUserId', protectedRoute, sendFriendRequest);
router.post('/follow/:targetUserId', protectedRoute, followUser);
router.post('/unfollow/:targetUserId', protectedRoute, unfollowUser);
router.get('/requests', protectedRoute, getFriendRequests);

export default router;
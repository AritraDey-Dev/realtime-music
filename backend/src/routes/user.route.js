import { Router } from 'express';
import { protectedRoute } from '../middleware/auth.middleware.js';
import {  friendsRequest, getAllUsers, getLikedSongs, getPlaylists, likeSong } from '../controller/user.controller.js';
import { getMessages } from '../controller/user.controller.js';
const router = Router();

router.get('/',protectedRoute,getAllUsers);
router.get("/messages/:userId", protectedRoute, getMessages);
router.get("/likedSongs", protectedRoute, getLikedSongs);
router.get("/playlists/:id", protectedRoute, getPlaylists);
router.post('/:id', protectedRoute, likeSong);
router.post('/followrequest/:id', protectedRoute, friendsRequest);

export default router;
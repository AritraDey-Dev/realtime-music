import { Router } from 'express';

const router = Router();

import { addSongToPlaylist, createPlaylist, deletePlaylist, getAllPlaylists, getPlaylistById, removeSongFromPlaylist } from '../controller/playlist.controller.js';

import { protectedRoute } from '../middleware/auth.middleware.js';

router.post('/', protectedRoute, createPlaylist);
router.get('/', protectedRoute, getAllPlaylists);
router.get('/:id', protectedRoute, getPlaylistById);
router.post('/addtoPlaylist', protectedRoute, addSongToPlaylist);
router.delete('/removeSongFromPlaylist', protectedRoute, removeSongFromPlaylist);
router.delete('/removefromPlaylist/:id',protectedRoute,deletePlaylist);


export default router;
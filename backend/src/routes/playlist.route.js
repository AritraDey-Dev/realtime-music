import { Router } from 'express';

const router = Router();

import { addSongToPlaylist, createPlaylist, deletePlaylist, getAllPlaylists, getPlaylistById, getSongsInPlaylist, removeSongFromPlaylist, editPlaylist } from '../controller/playlist.controller.js';

import { protectedRoute } from '../middleware/auth.middleware.js';

router.post('/', protectedRoute, createPlaylist);
router.get('/', protectedRoute, getAllPlaylists);
router.get('/:id', protectedRoute, getPlaylistById);
router.post('/addtoPlaylist', protectedRoute, addSongToPlaylist);
router.post('/removeSongFromPlaylist', protectedRoute, removeSongFromPlaylist);
router.delete('/:id',protectedRoute,deletePlaylist);
router.get('/:id/songs',protectedRoute,getSongsInPlaylist);
router.put('/:id', protectedRoute, editPlaylist);


export default router;
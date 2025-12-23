import { Router } from 'express';
import { protectedRoute, requireAdmin } from '../middleware/auth.middleware.js';
import {  getAllSongs, getAllSongsPublic, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs, searchSongs } from '../controller/song.controler.js';
import { createPlaylist } from '../controller/playlist.controller.js';

const router = Router();


router.get('/',protectedRoute,requireAdmin, getAllSongs);
router.get('/all', getAllSongsPublic);
router.get('/featured',getFeaturedSongs); 
router.get('/made-for-you', getMadeForYouSongs);
router.get('/trending', getTrendingSongs);
router.get('/search', protectedRoute, searchSongs);


export default router;
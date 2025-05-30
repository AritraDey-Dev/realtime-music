import { Router } from 'express';
import { protectedRoute, requireAdmin } from '../middleware/auth.middleware.js';
import {  getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs } from '../controller/song.controler.js';
import { createPlaylist } from '../controller/playlist.controller.js';

const router = Router();


router.get('/',protectedRoute,requireAdmin, getAllSongs);
router.get('/featured',getFeaturedSongs); 
router.get('/made-for-you', getMadeForYouSongs);
router.get('/trending', getTrendingSongs);


export default router;
import { Router } from 'express';
import { getAdmin } from '../controller/admin.controller.js';
import { protectedRoute, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();


router.get('/',getAdmin);
// router.post("/",protectedRoute,requireAdmin,createSong);


export default router;
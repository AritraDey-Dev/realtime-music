import { Router } from 'express';
import { search } from '../controller/search.controller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protectedRoute, search);

export default router;

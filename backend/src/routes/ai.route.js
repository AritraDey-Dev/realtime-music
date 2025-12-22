import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { generatePlaylist } from "../controller/ai.controller.js";

const router = express.Router();

router.post("/generate", protectedRoute, generatePlaylist);

export default router;

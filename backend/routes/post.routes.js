import express from 'express';
import {protectRoute} from "../middleware/protectRoute.js"
import { createPost, deletePost, commentPost, likeUnlikePost } from '../controllers/post.controller.js';

const router = express.Router();


router.post("/create", protectRoute, createPost)
router.delete("/:id", protectRoute, deletePost)
router.post("/like/:id", protectRoute, likeUnlikePost)
router.post("/comment/:id", protectRoute, commentPost)





export default router;
import express from 'express';
import {protectRoute} from "../middleware/protectRoute.js"
import { createPost, deletePost } from '../controllers/post.controller.js';

const router = express.Router();


router.post("/create", protectRoute, createPost)
router.delete("/:id", protectRoute, deletePost)
//router.post("/comment/:id", protectRoute, likeUnlikePost)
//router.post("/like/:id", protectRoute, commentPost)





export default router;
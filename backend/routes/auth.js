import express from "express";
import { signup, login, logout, getMe } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";


console.log("✅ authRoutes file loaded");

const router = express.Router();

router.post("/signup", signup); // connecting w/ controller folder
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, getMe);



export default router;
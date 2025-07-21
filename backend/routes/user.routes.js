import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile, followUnfollowUser, updateUserProfile, getSuggestedProfile} from "../controllers/user.controller.js"


console.log("✅ user routes file loaded");

const router = express.Router();


router.get("/profile/:Username", protectRoute, getUserProfile) // middleware protection is used, to ensure only authenticated users can accesss
router.get("/suggested", protectRoute,  getSuggestedProfile)
router.post("/follow/:id", protectRoute, followUnfollowUser)
//router.post("/update",protectRoute, updateUserProfile)





export default router;
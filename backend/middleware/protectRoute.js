import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req,res,next) =>{
    try{
        const token = req.cookies.jwt;
        if (!token){ // if yung cookie aint exisiting 
            return res.status(401).json({error: "Unauthorized: No token provided."})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET) // verifying cookie
        if (!decoded){
            return res.status(401).json({error: "Unauthorized: Invalid Token"})
        }

        const user = await User.findById(decoded.userId).select("-Password")
        if(!user){
            return res.status(404).json({error: "User not found"})
        }

        req.user = user; // attaching the logged-in user's data to the req (request) object.
        next(); // calling next function // which is getme() check auth.js

    }
    catch (error){
        console.log("Error in protectRoute middleware", error.message)
        return res.status(500).json({error: "Internal Server Error"})
    }
}
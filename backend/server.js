import express from "express";
import dotenv from "dotenv"; // loads env file 
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import { v2 as cloudinary } from 'cloudinary'; // import for cloudinary

import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";


dotenv.config();

// setting up cloudinary connecting from .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
}) 

const app = express();
const PORT = process.env.PORT;
app.use(express.json());  // middleware that runs between req and res. or to parse req.body
app.use(express.urlencoded({extended: true}));
app.use(cookieParser()); // middleware lets your app read cookies that the frontend/browser sends with requests.

app.get("/", (req, res) => {
    res.send("🚀 Server is working!");
});
  
app.use("/api/auth", authRoutes); // connecting routes for authentication
app.use("/api/user", userRoutes);


app.listen(PORT, () => { // this starts server @ prort 2000
    console.log(`port is running at ${PORT}`);
    connectMongoDB();
})
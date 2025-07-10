import express from "express";
import dotenv from "dotenv"; // loads env file 
import authRoutes from "./routes/auth.js";


dotenv.config();

const app = express();

console.log(process.env.MONGO_URI); // reads env

app.use("/api/auth", authRoutes); // connecting routes for aauthetntication

app.listen(2000, () => { // this starts server @ prort 2000
    console.log("port is running at port 2000 ")
})
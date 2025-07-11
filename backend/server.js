import express from "express";
import dotenv from "dotenv"; // loads env file 
import authRoutes from "./routes/auth.js";
import connectMongoDB from "./db/connectMongoDB.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json()); 

app.get("/", (req, res) => {
    res.send("🚀 Server is working!");
});
  
app.use("/api/auth", authRoutes); // connecting routes for aauthetntication

app.listen(PORT, () => { // this starts server @ prort 2000
    console.log(`port is running at ${PORT}`);
    connectMongoDB();
})
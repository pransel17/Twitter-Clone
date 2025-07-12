import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../lib/utils/generateToken.js"




// SIGN UP FUNCTIONALITY 
export const signup = async (req, res) =>{
    try{
        const {FullName, Username, Email, Password} = req.body; 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // diko alam to pero useful for verifying email formats oki

        if(!emailRegex.test(Email)){
            return res.status(400).json({ error: "Invalid email format"})
        }

        const existingUser = await User.findOne({Username}); // checking collection if may existing username
        if (existingUser){
            return res.status(400).json({ error: "Username is already taken "});
        }
        
        const existingEmail = await User.findOne({Email}); // checking collection if may existing username
        if (existingEmail){
            return res.status(400).json({ error: "Email is already taken "});
        }


        if(Password.length < 6){
            return res.status(400).json({ error: "Password must be at least 6 characters"});
        }

        // hash passsword


        const salt = await bcrypt.genSalt(10); // bcrypt helps encrypt passwords before storing them in a database, security purpp
        const hashedPassword = await bcrypt.hash(Password,salt);

        const newUser = new User({
            FullName,
            Username,
            Email,
            Password: hashedPassword
        })


        if(newUser){
            generateTokenAndSetCookie(newUser._id, res) // helper function: It uses the user's Mongo _id to create a token It uses the user's Mongo _id to create a token
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                FullName: newUser.FullName,
                Username: newUser.Username,
                Email: newUser.Email,
                Followers: newUser.Followers,
                Following: newUser.Following,
                ProfileImage: newUser.ProfileImage,
                CoverImage: newUser.CoverImage,
            })
        } 
        else{
            res.status(400).json({error: "Invalid user data"})
        }


    } 
    catch (error){
       console.log("Error in signup controller", error.message)
       res.status(500).json({error: "Invalid user data"})
    }
}




// LOGIN FUNCTIONALITY 
export const login = async (req, res) =>{

    
}

export const logout = async (req, res) =>{
    res.json({
        data: "You hit the logout endpoint",
    });
}
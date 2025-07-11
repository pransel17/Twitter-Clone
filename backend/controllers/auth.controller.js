import User from "../models/user.model.js";

export const signup = async (req, res) =>{
    try{
        const {Fullname, Username, Email, Password} = req.body; 
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
    } catch (error){

    }

}

export const login = async (req, res) =>{
    res.json({
        data: "You hit the login endpoint",
    });
}

export const logout = async (req, res) =>{
    res.json({
        data: "You hit the logout endpoint",
    });
}
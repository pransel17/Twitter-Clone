import User from "../models/user.model.js"
import  Notification  from "../models/notification.model.js"

import bcrypt from "bcryptjs"
import { v2 as cloudinary } from 'cloudinary';


export const getUserProfile = async (req,res) => {
    const {Username} = req.params

    try{
        const user  = await User.findOne({Username}).select("-Password")
        if(!user){ // if not existing
            return res.status(404).json({error: "User not found"})
        }
        res.status(200).json(user); // if good // tested in postman it must return the info of user
    } catch(error){
        res.status(500).json({error:error.message})
        console.log("Error in getUserProfile: ", error.message)  
    }
}



export const followUnfollowUser = async (req,res) => {
    try{
        const { id } = req.params; //  someone's id from your route URL.
        const userToModify = await User.findById(id) // finds the user you want to follow/unfollow
        const currentUser = await User.findById(req.user._id) // checking is the logged-in user's ID, added by protectRoute

        if(id.toString() === req.user._id.toString()){
            return res.status(400).json({error: "You cant follow/unfollow yourself"})
        }

        if(!userToModify || !currentUser){
            return res.status(404).json({error: "User not found"})
        }

        // updating my following array in usermodel
        const isFollowing = currentUser.Following.includes(id); // .Following from my userSchema
        
        if(isFollowing){ // if already following, so this is unfollow method pullingg
            await User.findByIdAndUpdate(id, {$pull: {Followers: req.user._id}}) // removingg 
            await User.findByIdAndUpdate(req.user._id, {$pull: {Following: id}})
            res.status(200).json({message: "User unfollowed successfully"})

        } else{ // following method
            await User.findByIdAndUpdate(id, { $push : { Followers: req.user._id } }) //Add YOU to someone's followers
            await User.findByIdAndUpdate(req.user._id, { $push: {Following: id } }) // Add someone to your following list

            // trigger notif
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id, // kung sino cuurent user, or naka login w/ there specific id
                to: userToModify._id,
            });

            await newNotification.save()

            res.status(200).json({message: "User followed successfully"})

        } 

    } catch(error){
        res.status(500).json({error:error.message})
        console.log("Error in followUnfollowUser: ", error.message) 
    }
}
    


export const getSuggestedProfile = async(req,res) =>{
    try{ 
        // exclude current user
        const userId = req.user._id; // from JWT token authentication middleware.

        const usersFollowedByMe = await User.findById(userId).select("Following"); // find users alrready followed by ,e

        const users = await User.aggregate([ // get 10 random users 
            {
                $match:{
                    _id: {$ne: userId} // excluding me
                }
            },
            {$sample:{size:10}}
        ])

        const filteredUsers = users.filter(user=>!usersFollowedByMe.Following.includes(user._id)) // Remove people I already follow from the random 10 (users array) 
        const suggestedUsers = filteredUsers.slice(0,4) // get 4 people from users array, that is remaining w/o people i followed
        suggestedUsers.forEach(user=>user.Password=null) // trying to hide passwords before sending data to the frontend

        res.status(200).json(suggestedUsers)

    } catch (error){
        res.status(500).json({error:error.message})
        console.log("Error in getSuggestedProfile: ", error.message) 
    }
}


// this is long since user will modify their profile, meaning their own database will be modified here :(
export const updateUser = async (req,res) => {
        const {fullname, email, username, currentPassword, newPassword, bio, link} = req.body
        let {profileIMG, coverImg} = req.body;

        const userID = req.user._id; // id of ccurennt user

        try{
            const user = await User.findById(userID);
            if(!user) return res.status(404).json({message: "User not found"});

            if((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
                return res.status(400).json({error: "Please provide both current password and new password"})
            }

            if(currentPassword && newPassword){
                const isMatch = await bcrypt.compare(currentPassword, user.Password) // comparing the pass from db
                if(!isMatch) return res.status(400).json({ error: "Current password is incorrect"})
                if(newPassword.length < 6){
                    return res.status(400).json({error: "Password must be at least 6 characters long"})
                }

                // the usual password security gorlie
                const salt = await bcrypt.genSalt(10);
                user.Password = await bcrypt.hash(newPassword, salt)

                // WILL BE USING CLOUDINARY HEREE
                // Cloudinary is a cloud-based media management 
                // Stores images and videos
                // Gives you a URL back so you can load it in your frontend
                // Great for handling user profile pictures, uploads, etc


                if(profileIMG){
                    const uploadedResponse = await cloudinary.uploader.upload(profileIMG); // uploads the profileIMG to Cloudinary
                    profileIMG = uploadedResponse.secure_url; // overwrites the original profileIMG variabl
                }

                if(coverImg){
                    const uploadedResponse = await cloudinary.uploader.upload(coverImg);
                    coverImg = uploadedResponse.secure_url;
                }

                // either keep the input or the existing value in db 

                user.FullName = fullname || user.FullName
                user.Email = email || user.Email
                user.Username = username || user.Username
                user.bio = bio || user.bio
                user.link = link || user.link
                user.ProfileImage = profileIMG || user.ProfileImage
                user.CoverImage = coverImg || user.CoverImage

                user = await user.save(); // u know mgdb saverr
                user.Password = null

                return res.status(200).json(user);


            }



        } catch (error) {
    
        }


}

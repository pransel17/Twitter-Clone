import User from "../models/user.model.js"
import  Notification  from "../models/notification.model.js"


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
        const userId = req.user._id;

        const usersFollowedByMe = await User.findById(userId).select("following");


    } catch (error){

    }

}


export const updateUserProfile = async (req,res) => {

}

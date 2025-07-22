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
            if(!user) return res.status(404).jsom({messae: "User not found"});



        } catch (error) {
    
        }


}

import User from "../models/user.model.js";
import Post from "../models/post.models.js" 
import { v2 as cloudinary } from 'cloudinary';
import Notification from "../models/notification.model.js"

console.log("Post controller is working")

export const createPost = async (req,res) => {
    try{
        const {text} = req.body;
        let {img} = req.body; // magrreassign pa latur
        const userID = req.user._id.toString();

        const user = await User.findById(userID).select("-Password");
        if(!user) return res.status(404).json({message: "User not found"})
        if(!text && !img) {
            return res.status(500).json({error: "Post must have text or image"})
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({ // i love instatiation oopp
            user: userID,
            text,
            img
        })

        await newPost.save()
        res.status(201).json(newPost)

    } catch(error){
        res.status(500).json({error: "Post is unsuccessffull"});
        console.log("Error in createPost controller", error)
    }

}

export const deletePost = async (req,res) =>{
    try{
        const post = await Post.findById(req.params.id) // finding ano id ng post owner
        if(!post){
            return res.status(404).json({error: "Post not found"})
        }

        if(post.user.toString() !== req.user._id.toString()){ // if not same id yung post owner and currently logged in user
            return res.status(401).json({error: "Your're not authorized to delete this post."})
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "Post deleted successfully" });


    } catch(error){
        res.status(500).json({error: "Error in deleteing "});
        console.log("Error in deletePost controller", error)
    }
}

export const commentPost = async (req,res) => {
    try{
        const {text} = req.body
        const postId = req.params.id;
        const userId = req.user._id;
        
        if(!text){
            return res.status(400).json({error: "Text field is required"});
        }

        const post = await Post.findById(postId)
        if(!post){
            return res.status(400).json({error: "Post not found"});
        }

        const comment = {user: userId, text}
        post.comments.push(comment)
        await post.save()
        res.status(200).json(post)


    } catch(error) {
        res.status(500).json({error: "Internal server error "});
    }
 
}

// yo bro gonna take undeserve rest
export const likeUnlikePost = async (req,res) => {
    try{
        const userId = req.user._id 
        const {id:postId} = req.params

        const post = await Post.findById(postId)
        

        if(!post){
            return res.status(400).json({error: "Post not found"});
        }

        const userLikedPost = post.likes.includes(userId)

        if(userLikedPost){
            // unlike post: userId already exist in the post array
            await Post.updateOne({_id:postId}, {$pull: {likes: userId}}) // // filter: find this user by id, update: remove postId from their "likes" array
            await User.updateOne({_id:userId}, {$pull: {likedPosts: postId}})

            res.status(200).json({message: "Post unliked"});
        }
        else{
            // Like post
            post.likes.push(userId)
            await User.updateOne({_id:userId}, {$push: { likedPosts: postId }})
            await post.save()


            // send notif
            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })

            await notification.save()
            res.status(200).json({message: "Post liked successfully"})
        }

    } catch (error) {
        res.status(500).json({error: "Internal server error "});
    }
}

export const getAllPosts = async (req,res) => {
    try{

        const posts = await Post.find().sort({ createdAt: -1 }).populate({ // that -1 will put new post at front

            path: "user",
            select: "-Password",
        }).populate({ // FETCHES THE ENTIRE DOCUMENT 
            path: "comments.user",
            select: "-Password"
        })


        if(posts.length === 0 ) {
            return res.status(200).json([])
        }

        res.status(200).json(posts)

    } catch (error){
        res.status(500).json({error: "Internal server error "});
    }
}


export const getLikedPosts = async (req,res) => {
    const userId = req.params.id;

    try{
        const user = await User.findById(userId)
        if(!user) return res.status(404).json({error: "User not found"})

        const likedPosts = await Post.find({_id: { $in: user.likedPosts } })
        .populate({
            path: "user",
            select: "-Password"
        })
        .populate({
            path: "comments.user",
            select: "-Password"
        })

        res.status(200).json(likedPosts)
    } catch (error){
        res.status(500).json({error: "Internal server error "});
    }

}
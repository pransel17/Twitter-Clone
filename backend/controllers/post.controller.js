import User from "../models/user.model.js";
import Post from "../models/post.models.js" 
import { v2 as cloudinary } from 'cloudinary';

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
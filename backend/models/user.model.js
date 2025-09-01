import mongoose from "mongoose";

// schema, which is like a blueprint for your MongoDB documents.
const userSchema = new mongoose.Schema({

    //creating forms like tables naman sa sql

    Username: {
        type: String,
        required: true,
        unique: true,
    },

    FullName: {
        type: String,
        required: true,
    },

    Password: {
        type: String,
        required: true,
        minLength: 6
    },

    Email:{
        type: String,
        required: true,
        unique: true,
    },

    Followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],

    Following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],

    ProfileImage:{
        type: String,
        default: "",
    },

    CoverImage:{
        type: String,
        default: "",
    },

    bio:{
        type: String,
        default: "",
    },

    link:{
        type: String,
        default: "",
    },

    likedPosts: [
        {
           type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: []
        }
    ]

}, {timestamps: true}
);

// slayedd model is like a class or a toolbox that lets you interact with a MongoDB collection.

const User = mongoose.model("User", userSchema);

export default User;
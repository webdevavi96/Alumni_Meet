import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt:{
        type: String,
    },
}, { timestamps: true });

export const Blog = mongoose.model("Blog", blogSchema)
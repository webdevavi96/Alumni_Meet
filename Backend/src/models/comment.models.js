import mongoose, { Schema } from "mongoose";

const commentScema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    },
    onBlog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    }
}, { timestamps: true });

export const Comment = mongoose.model("Coment", commentScema);
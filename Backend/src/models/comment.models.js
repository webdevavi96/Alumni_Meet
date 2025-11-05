import mongoose, { Schema } from "mongoose";

const commentScema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    },
    onBlog: {
        type: Schema.Types.ObjectId,
        ref: "Blog"
    }
}, { timestamps: true });

export const Comment = mongoose.model("Cooment", commentScema);
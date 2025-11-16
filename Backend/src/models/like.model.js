import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    likedOn: {
        type: Schema.Types.ObjectId,
        ref: "Blog"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    liked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Like = mongoose.model("Like", likeSchema);
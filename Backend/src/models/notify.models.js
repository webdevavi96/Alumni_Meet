import mongoose, { Schema } from "mongoose";

const notifySchema = new Schema({
    setBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    setOn: {
        type: Schema.Types.ObjectId,
        ref: "Event"
    }
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notifySchema);
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    meetingUrl:{
        type: String,
        required: true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    startTime:{
        type: String,
        required: true,
    },
    duration:{
        type: String,
        required: true,
    },
    eventDate:{
        type: String,
        required: true,
    },
    createdAt:{
        type: String,
    },

}, { timestamps: true });

export const Event = mongoose.model("Event", eventSchema)
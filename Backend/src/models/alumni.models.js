import mongoose from "mongoose";

const alumniSchema = mongoose.Schema({
    details: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    passingYear: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    compony: {
        type: String,
        required: true,
    },
});


export const Alumni = mongoose.model("Alumni", alumniSchema);
import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
    details: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    enrollementNumber: {
        type: Number,
        unique: true,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    }
});

export const Student = mongoose.model("Student", studentSchema);
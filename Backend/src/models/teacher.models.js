import mongoose from "mongoose";

const teacherSchema = mongoose.Schema({
    details: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    subject: {
        type: String,
        required: true,
    },
    headOfDepartment: {
        type: String,
    },
    teacherId: {
        type: String,
        required: true,
        unique: true,
    },
});


export const Teacher = mongoose.model("Teacher", teacherSchema);
import DB_NAME from "../constants.js";
import mongoose from "mongoose";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`)
        console.log("Database connected!", connectionInstance.connection.host)
    } catch (error) {
        console.log("Database connection error: ", error)
        process.exit(1)
    }
}

export default connectDB
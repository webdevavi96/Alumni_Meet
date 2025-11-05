import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";


const uploadToCloudinary = async (localFilePath) => {
    try {
        // Uploading the file to cloudinary.
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        fs.unlinkSync(localFilePath);
        return response;
    }
    catch (error) {
        fs.unlinkSync(localFilePath); // Remove the locally saved temporsry file as the upload operation got failed.
        return null;
    }
};

export default uploadToCloudinary;
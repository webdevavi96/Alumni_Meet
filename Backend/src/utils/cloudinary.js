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
        fs.unlinkSync(localFilePath);
        return null;
    }
};

export default uploadToCloudinary;
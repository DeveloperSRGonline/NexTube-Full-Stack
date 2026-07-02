import { v2 as cloudinary } from "cloudinary";
import fs from "fs"


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null; // get out 😠

        // Configure Cloudinary inside the function so process.env is loaded
        cloudinary.config({ 
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
          api_key: process.env.CLOUDINARY_API_KEY, 
          api_secret: process.env.CLOUDINARY_API_SECRET
        });

        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        // file has been uploaded successfully
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        // remove the locally saved temporary file as the upload operation failed
        try {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        } catch (unlinkError) {
            console.error("Failed to delete local temp file:", unlinkError);
        }
        return null;
    }
}

export { uploadOnCloudinary }
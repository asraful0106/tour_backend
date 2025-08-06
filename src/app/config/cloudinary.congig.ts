import { v2 as cloudinary } from "cloudinary";
import AppError from "../errorHelpers/AppError";
import { envVars } from "./env";

cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
});

export const cloudinaryUpload = cloudinary;

export const deleteImageFromCloudinary = async (url : string) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i; // regex for getting the document name 
        
        const match = url.match(regex);

        if(match && match[1]){
            const public_id = match[1];
            await cloudinary.uploader.destroy(public_id);
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        throw new AppError(401, "Cloudinary image deletion failed", err.message)
    }
}
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.congig";
import multer from "multer";

const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: {
        public_id: (req, file) => {
            const fileName = file.originalname.split(".")[0]
                .toLowerCase()
                .replace(/\s+/g, "-") // replace empty space
                .replace(/\./g, "-") //replace any dot(.)
                // eslint-disable-next-line no-useless-escape
                .replace(/[^a-z0-9\-\.]/g, "") // replace non aplpha neumeric
            
            const uiqueFileName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileName;
            return uiqueFileName;
        }
    }
});

export const multerUpload = multer({storage: storage});
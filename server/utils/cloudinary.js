import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// Cloudinary Configuration (Make sure .env variables are correctly loaded)
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Debugging - Check if env variables are loaded
// console.log("Cloudinary Config:", {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "NOT SET"
// });

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error("No local file path provided for upload.");
      return null;
    }

    // Normalize file path (important for Windows)
    const normalizedPath = path.normalize(localFilePath);
    console.log("Uploading file to Cloudinary from path:", normalizedPath);

    const response = await cloudinary.uploader.upload(normalizedPath, {
      resource_type: "auto", // auto-detect image/video/etc
    });

    //console.log("Upload successful! File URL:", response.secure_url);

    // Delete the local file after successful upload
    fs.unlinkSync(normalizedPath);

    return response;

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    // Safely delete temp file if exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("Temp file deleted due to error.");
    }

    return null;
  }
};

export { uploadOnCloudinary };

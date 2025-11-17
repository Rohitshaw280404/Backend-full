import {v2 as cloudinary} from "cloudinary";
import fs from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
}); 

const uploadToCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload the file on cloudinary
      const response = await cloudinary.uploader.upload
      (localFilePath, {
            resouce_type: "auto"

            })
               // file has been uploaded
               //console.log("file is uploaded on cloudinary
              fs.unlinkSync(localFilePath)  // remove the locally saved temp file
               return response;

        


    } catch (error) {
        fs.unlinkSync(localFilePath)  // remove the locally saved temp file as the upload option got failed
         return null;

    }
}


export {uploadToCloudinary};  
                     

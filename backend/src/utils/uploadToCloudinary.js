import { Readable } from "stream";

import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(

            {
                folder: "BatchBite/menu-items"
            },

            (error, result) => {

                if (error) {

                    reject(error);

                } else {

                    resolve(result);

                }

            }

        );

        Readable.from(fileBuffer).pipe(stream);

    });

};

export default uploadToCloudinary;
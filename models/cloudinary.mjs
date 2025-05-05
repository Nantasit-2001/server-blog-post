import cloudinary from 'cloudinary';
import { Readable } from 'stream';
const { uploader } = cloudinary;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = (image) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream({ folder: 'your-folder' }, (error, result) => {
      if (error) return reject(error);
      resolve(result); 
    });
    const bufferStream = new Readable();
    bufferStream.push(image.buffer);
    bufferStream.push(null);
    bufferStream.pipe(stream);
  });
};

export const deleteImageToCloudinary = async(imageUrl) =>{
    const publicId = extractPublicIdFromUrl(imageUrl); 
      try {
        await uploader.destroy(publicId); 
        console.log(`Successfully deleted old image: ${publicId}`);
      } catch (deleteError) {
        console.error(`Error deleting image: ${deleteError.message}`);
      }
}
export function extractPublicIdFromUrl(url) {
    const regex = /\/v\d+\/(.*?)(?:\.\w+)?$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
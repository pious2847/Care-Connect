const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

async function  cleanupUploadedFile(req, fieldName) {
  if (req.files && req.files[fieldName]) {
    await cloudinary.uploader.destroy(req.files[fieldName][0].public_id);
  }
} 
module.exports = {cloudinary, cleanupUploadedFile};
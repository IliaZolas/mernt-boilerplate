const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.AWS_ACCESS_KEY_ID,
    api_secret: process.env.AWS_SECRET_ACCESS_KEY
  });

exports.module = cloudinaryCongfig;
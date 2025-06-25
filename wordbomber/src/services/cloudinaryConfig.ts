// import { Cloudinary } from '@cloudinary/url-gen';

// // Create and configure your Cloudinary instance
// const cld = new Cloudinary({
//   cloud: {
//     cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
//     apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
//     apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET
//   }
// });

// export { cld };


// cloudinaryConfig.js

import { Cloudinary } from '@cloudinary/url-gen';

export const cld = new Cloudinary({
  cloud: {
    cloudName: 'dy4nvvdwd',
  }
});

// import CloudinaryContext  from 'cloudinary-react';

// const cloudinaryConfig = {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET_KEY
// };

// export { CloudinaryContext, cloudinaryConfig };


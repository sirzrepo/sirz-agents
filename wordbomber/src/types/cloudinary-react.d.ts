declare module 'cloudinary-react' {
  import { ComponentType } from 'react';

  export interface CloudinaryContextProps {
    cloudName: string;
    [key: string]: any;
  }

  export interface ImageProps {
    publicId: string;
    width?: string | number;
    height?: string | number;
    crop?: string;
    [key: string]: any;
  }

  export const CloudinaryContext: ComponentType<CloudinaryContextProps>;
  export const Image: ComponentType<ImageProps>;
  // Add other components you're using from cloudinary-react
}

declare module 'cloudinary-react' {
  import * as React from 'react';

  export interface CloudinaryContextProps {
    cloudName: string;
    uploadPreset?: string;
    children?: React.ReactNode;
  }

  export interface ImageProps {
    publicId: string;
    width?: string | number;
    height?: string | number;
    crop?: string;
    gravity?: string;
    [key: string]: any;
  }

  export interface VideoProps {
    publicId: string;
    width?: string | number;
    height?: string | number;
    [key: string]: any;
  }

  export class CloudinaryContext extends React.Component<CloudinaryContextProps> {}
  export class Image extends React.Component<ImageProps> {}
  export class Video extends React.Component<VideoProps> {}
  export class Transformation extends React.Component<{ [key: string]: any }> {}
  
  // Add other Cloudinary components as needed
}

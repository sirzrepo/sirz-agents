declare module 'cloudinary-react' {
    import * as React from 'react';

    export interface CloudinaryContextProps {
        cloudName: string;
        uploadPreset?: string;
        children?: React.ReactNode;
    }

    export class CloudinaryContext extends React.Component<CloudinaryContextProps> {}
    
    export interface ImageProps {
        publicId: string;
        width?: string | number;
        height?: string | number;
        crop?: string;
        className?: string;
        alt?: string;
        children?: React.ReactNode;
    }

    export class Image extends React.Component<ImageProps> {}

    export interface VideoProps {
        publicId: string;
        width?: string | number;
        height?: string | number;
        controls?: boolean;
        className?: string;
    }

    export class Video extends React.Component<VideoProps> {}

    export interface TransformationProps {
        width?: string | number;
        height?: string | number;
        crop?: string;
        gravity?: string;
        quality?: string | number;
        radius?: string | number;
        effect?: string;
        opacity?: number;
        angle?: number;
    }

    export class Transformation extends React.Component<TransformationProps> {}
}

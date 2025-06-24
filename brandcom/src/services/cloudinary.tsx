



// ImageUploadComponent.js

// import React from 'react';


// const ImageUploadComponent = ({ onUpload }: { onUpload: (publicId: string) => void }) => {
//     const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('upload_preset', 'mhatons1');

//         try {
//             const res = await fetch('https://api.cloudinary.com/v1_1/dy4nvvdwd/image/upload', {
//                 method: 'POST',
//                 body: formData,
//             });
//             const result = await res.json();
//             onUpload(result.public_id); // ✅ Send Cloudinary public_id
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     return <input type="file" accept="image/*" onChange={handleImageUpload} />;
// };


// export default ImageUploadComponent;






import { v4 as uuidv4 } from 'uuid';

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  format: string;
  bytes: number;
  secure_url: string;
  original_filename: string;
  created_at: string;
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'mhatons1');
  formData.append('public_id', `${Date.now()}-${uuidv4()}`);
  formData.append('timestamp', (Date.now() / 1000).toString());

  try {
    const response = await fetch('https://api.cloudinary.com/v1_1/dy4nvvdwd/image/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Image upload failed');
    }

    const result = await response.json();
    
    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      secure_url: result.secure_url,
      original_filename: result.original_filename,
      created_at: result.created_at
    };
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// React Component for UI-based uploads
import React, { useState } from 'react';
import { Loader2, ImageIcon } from 'lucide-react';

interface ImageUploadComponentProps {
  onUpload: (result: CloudinaryUploadResult) => void;
  buttonText?: string;
  className?: string;
  accept?: string;
  disabled?: boolean;
}

export const ImageUploadComponent: React.FC<ImageUploadComponentProps> = ({
  onUpload,
  buttonText = 'Upload Image',
  className = '',
  accept = 'image/*',
  disabled = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const result = await uploadToCloudinary(file);
      onUpload(result);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      // Reset the input to allow selecting the same file again
      e.target.value = '';
    }
  };

  return (
    <div className={`border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 ${className}`}>
      <label className="flex flex-col items-center justify-center w-full h-48 cursor-pointer relative transition-all hover:border-blue-500">
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
        ) : (
          <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
        )}
        <p className="text-sm text-gray-600 text-center">
          {isUploading ? 'Uploading...' : buttonText}
        </p>
        <input 
          type="file" 
          accept={accept} 
          onChange={handleFileChange} 
          className="hidden" 
          disabled={isUploading || disabled}
        />
      </label>
    </div>
  );
};

export default ImageUploadComponent;




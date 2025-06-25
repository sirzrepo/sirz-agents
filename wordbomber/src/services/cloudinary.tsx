
import React, { useState } from 'react';
import { CloudinaryContext, Image } from 'cloudinary-react';
import { ImageIcon, Loader2 } from 'lucide-react';

interface Props {
  onUpload: (publicId: string) => void;
  initialPublicId?: string;
  buttonText?: string;
  className?: string;
}

const ImageUploadComponent: React.FC<Props> = ({
  onUpload,
  initialPublicId = '',
  buttonText = 'Upload Cover Image',
  className = ''
}) => {
  const [publicId, setPublicId] = useState(initialPublicId);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'mhatons1');

    setIsUploading(true);

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dy4nvvdwd/image/upload', {
        method: 'POST',
        body: formData
      });

      const result = await res.json();
      setPublicId(result.public_id);
      onUpload(result.public_id);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <CloudinaryContext cloudName="dy4nvvdwd">
      <div className={`border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 ${className}`}>
        <label className="flex flex-col items-center justify-center w-full h-48 cursor-pointer relative transition-all hover:border-blue-500">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
          )}
          <p className="text-sm text-gray-600 text-center">{isUploading ? 'Uploading...' : buttonText}</p>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
        </label>

        {publicId && (
          <div className="mt-4 w-full rounded overflow-hidden">
            <Image 
              publicId={publicId} 
              alt="Uploaded" 
              className="rounded-md w-full h-auto"
              width="800"
              height="450"
              crop="fill"
              gravity="auto"
            />
          </div>
        )}
      </div>
    </CloudinaryContext>
  );
};

export default ImageUploadComponent;




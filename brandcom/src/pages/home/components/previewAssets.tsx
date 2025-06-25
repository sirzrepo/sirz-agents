import NotificationModal from "../../../components/layout/notificationModal";
import Button from "../../../components/common/ui/Button";
import { RootState } from "../../../store/store";
import { BASE_URL } from "../../../utils";
import axios from "axios";
import { Globe, ImageIcon, Palette, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NotificationType } from "@/types";
import { addProjectInactive } from "@/store/addProjectSlice";
// Cloudinary upload functionality is now handled directly in the component

interface GeneratedAssets {
    website_image: string
    logo_image: string
    color_palette: string
  }

interface PreviewAssetsProps {
  assets: GeneratedAssets;
  onBack: () => void;
}

export default function PreviewAssets({ assets, onBack }: PreviewAssetsProps) {
    const { userData } = useSelector((state: RootState) => state.user);
    const [error, setError] = useState<string | null>(null);
    const [responseStatus, setResponseStatus] = useState<NotificationType | "">("");
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useDispatch();

      const handleSaveAssets = async () => {
        if (!assets) {
          console.error("No assets to save");
          setError("No assets to save");
          return;
        }
    
        if (!assets?.website_image || !assets?.logo_image || !assets?.color_palette) {
          setError("Missing some required brand assets");
          return;
        }
        
        try {
          setIsSaving(true);
          setError(null);
          
          // For Azure Blob Storage or other external URLs, we'll use Cloudinary's fetch feature
          // which handles the download and upload in one step
          const uploadToCloudinaryFromUrl = async (url: string, publicId: string) => {
            const formData = new FormData();
            formData.append('file', url);
            formData.append('upload_preset', 'mhatons1');
            formData.append('public_id', publicId);
            
            const response = await fetch('https://api.cloudinary.com/v1_1/dy4nvvdwd/image/upload', {
              method: 'POST',
              body: formData,
            });
            
            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message || 'Failed to upload to Cloudinary');
            }
            
            const result = await response.json();
            return result.secure_url;
          };
          
          // Upload website image to Cloudinary if it's not already a Cloudinary URL
          let websiteImageUrl = assets.website_image;
          if (!websiteImageUrl.includes('cloudinary.com')) {
            try {
              websiteImageUrl = await uploadToCloudinaryFromUrl(websiteImageUrl, `website-${Date.now()}`);
            } catch (error) {
              console.error('Error uploading website image to Cloudinary:', error);
              throw new Error('Failed to upload website image to Cloudinary');
            }
          }
          
          // Upload logo to Cloudinary if it's not already a Cloudinary URL
          let logoImageUrl = assets.logo_image;
          if (!logoImageUrl.includes('cloudinary.com')) {
            try {
              logoImageUrl = await uploadToCloudinaryFromUrl(logoImageUrl, `logo-${Date.now()}`);
            } catch (error) {
              console.error('Error uploading logo to Cloudinary:', error);
              throw new Error('Failed to upload logo to Cloudinary');
            }
          }
          
          // Create payload with Cloudinary URLs
          const payload = {
            logo_image: logoImageUrl,
            website_image: websiteImageUrl,
            color_palette: assets.color_palette,
            userId: userData?.id || ""
          };
          
          console.log("Submitting assets with Cloudinary URLs:", {
            logo_image: logoImageUrl,
            website_image: websiteImageUrl,
            color_palette: !!assets.color_palette,
            userId: userData?.id || ""
          });
      
          const response = await axios.post(
            `${BASE_URL}/api/brand-data/assets`,
            payload
          );
      
          console.log("Server response:", response.data);
          dispatch(addProjectInactive());
        } catch (err) {
          console.error(err);
          const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
          setError(errorMessage);
          setResponseStatus("error");
        } finally {
          setIsSaving(false);
        }
      };


       return (
         <div className="max-w-6xl mx-auto p-6 space-y-8">
           <div className="text-center space-y-2">
             <h1 className="text-3xl font-bold text-slate-800">Your Brand Assets Are Ready!</h1>
             <p className="text-slate-600">Here are your custom-generated brand assets</p>
           </div>
   
           <div className="grid gap-6 md:grid-cols-2 ">
             {/* Website Image */}
             <section className="border-slate-200 shadow-lg">
               <div className="pb-3 bg-gradient-to-r from-purple-50 to-violet-50">
                 <h2 className="flex items-center gap-2 text-lg text-slate-800">
                   <Globe className="h-5 w-5" style={{ color: "#7e22ce" }} />
                   Website Mockup
                 </h2>
               </div>
               <div className="p-4">
                 <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden border">
                   <img
                     src={assets.website_image || "/placeholder.svg"}
                     alt="Generated website mockup"
                     className="w-full h-full object-cover"
                   />
                 </div>
               </div>
             </section>
   
             {/* Logo Image */}
             <section className="border-slate-200 shadow-lg">
               <div className="pb-3 bg-gradient-to-r from-purple-50 to-violet-50">
                 <h2 className="flex items-center gap-2 text-lg text-slate-800">
                   <ImageIcon className="h-5 w-5" style={{ color: "#7e22ce" }} />
                   Logo Design
                 </h2>
               </div>
               <div className="p-4">
                 <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden border flex items-center justify-center">
                   <img
                     src={assets.logo_image || "/placeholder.svg"}
                     alt="Generated logo"
                     className="max-w-full max-h-full object-contain"
                   />
                 </div>
               </div>
             </section>
   
            
           </div>
            {/* Color Palette */}
            <section className="border-slate-200 shadow-lg md:col-span-2 lg:col-span-1">
               <div className="pb-3 bg-gradient-to-r from-purple-50 to-violet-50">
                 <h2 className="flex items-center gap-2 text-lg text-slate-800">
                   <Palette className="h-5 w-5" style={{ color: "#7e22ce" }} />
                   Color Palette
                 </h2>
               </div>
               <div className="p-4">
                 <div className="bg-slate-50 rounded-lg p-4 border">
                   <pre className="text-sm whitespace-pre-wrap font-mono text-slate-700">{assets.color_palette}</pre>
                 </div>
               </div>
             </section>
   
           <div className="flex justify-center gap-4">
             <Button
               variant="outline"
               onClick={onBack}
               className="border-slate-300 text-slate-700 hover:bg-slate-50"
             >
               Generate New Assets
             </Button>
             <Button
               onClick={handleSaveAssets}
               className="text-white hover:opacity-90 flex items-center gap-2"
               style={{ backgroundColor: "#7e22ce" }}
               disabled={isSaving}
             >
               {isSaving ? (
                 <>
                   <Loader2 className="h-4 w-4 animate-spin" />
                   Uploading...
                 </>
               ) : 'Save Assets'}
             </Button>
             { error && <p className="text-red-500">{error}</p>}
           </div>

           {responseStatus && (
             <NotificationModal
                type={responseStatus as NotificationType}
               id="notification-preview"
             />
           )}
         </div>
       )
}
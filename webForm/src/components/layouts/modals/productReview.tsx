import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { Star, X } from "lucide-react";
import { toast } from "react-toastify";


export default function ProductReviewModal({
  isOpen,
  onClose,
  productId,
  productName,
  onReviewSubmit,
  existingReview,
}: {
  isOpen: boolean;
  onClose: () => void;
  productId: Id<"products">;
  productName: string;
  onReviewSubmit: (rating: number, comment: string) => Promise<void>;
  existingReview?: { rating: number; comment: string };
}) {
    const [rating, setRating] = useState(existingReview?.rating || 0);
      const [hoverRating, setHoverRating] = useState(0);
      const [comment, setComment] = useState(existingReview?.comment || "");
      const [isSubmitting, setIsSubmitting] = useState(false);

       if (!isOpen) return null;
      
        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          if (rating === 0) {
            toast.error("Please select a rating");
            return;
          }
          
          setIsSubmitting(true);
          try {
            await onReviewSubmit(rating, comment);
            onClose();
            toast.success("Review submitted successfully, Thank you!");
          } catch (error) {
            console.error("Failed to submit review:", error);
            toast.error("Failed to submit review. Please try again.");
          } finally {
            setIsSubmitting(false);
          }
        };

    
     return (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
         <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
           <div className="flex justify-between items-center p-4 border-b">
             <h3 className="text-lg font-medium">
               {existingReview ? "Update Your Review" : "Write a Review"}
             </h3>
             <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
               <X className="h-5 w-5" />
             </button>
           </div>
           
           <div className="p-4">
             <div className="flex items-center mb-4">
               <h4 className="font-medium">{productName}</h4>
             </div>
             
             <form onSubmit={handleSubmit}>
               <div className="mb-4">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Rating
                 </label>
                 <div className="flex">
                   {[1, 2, 3, 4, 5].map((star) => (
                     <button
                       key={star}
                       type="button"
                       className="focus:outline-none"
                       onClick={() => setRating(star)}
                       onMouseEnter={() => setHoverRating(star)}
                       onMouseLeave={() => setHoverRating(0)}
                     >
                       <Star
                         className={`h-8 w-8 ${
                           (hoverRating || rating) >= star
                             ? "text-yellow-400 fill-yellow-400"
                             : "text-gray-300"
                         }`}
                       />
                     </button>
                   ))}
                 </div>
               </div>
               
               <div className="mb-4">
                 <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                   Review (optional)
                 </label>
                 <textarea
                   id="comment"
                   rows={4}
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                   placeholder="Share your experience with this product..."
                   value={comment}
                   onChange={(e) => setComment(e.target.value)}
                 />
               </div>
               
               <div className="flex justify-end space-x-3">
                 <button
                   type="button"
                   onClick={onClose}
                   className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                   disabled={isSubmitting}
                 >
                   Cancel
                 </button>
                 <button
                   type="submit"
                   className="px-4 py-2 text-sm font-medium text-white bg-orange-500 border border-transparent rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                   disabled={isSubmitting || rating === 0}
                 >
                   {isSubmitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
                 </button>
               </div>
             </form>
           </div>
         </div>
       </div>
     );
    }
        
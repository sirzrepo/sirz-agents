import { Star, StarHalf, User } from 'lucide-react';
import Image from 'next/image';
import { formatRelativeTime } from '@/utils/formatters';

interface ReviewCardProps {
  rating: number;
  comment: string;
  userName: string;
  userImage?: string;
  createdAt: number;
  className?: string;
}

export function ReviewCard({
  rating,
  comment,
  userName,
  userImage,
  createdAt,
  className = '',
}: ReviewCardProps) {
  // Render stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {userImage ? (
            <Image
              src={userImage}
              alt={userName}
              width={40}
              height={40}
              className="rounded-full h-10 w-10 object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{userName}</h4>
            <span className="text-xs text-gray-500">
              {formatRelativeTime(createdAt)}
            </span>
          </div>
          <div className="flex items-center mt-1">
            <div className="flex">
              {renderStars()}
            </div>
            <span className="ml-2 text-sm text-gray-500">{rating.toFixed(1)}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{comment}</p>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
import { useInView } from "react-intersection-observer";
import { motion } from 'framer-motion';
import Image from "next/image";
import { Clock, Star, ShoppingCart, Heart, StarIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/contexts/CartContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

// Define product types to fix type errors
interface BaseProduct {
    id: Id<"products">;
    name: string;
    description?: string;
    image: string;
  }
  

interface StandardProduct extends BaseProduct {
    price: number;
    rating?: number;
    reviews?: number;
  }
  
  interface DiscountProduct extends BaseProduct {
    originalPrice: number;
    discountPrice?: number;
    discountPercent?: number;
    endsIn?: string;
  }


// Update ProductCard with proper type definitions
export const ProductCard = ({ 
  product, 
  isDiscount = false, 
  isInWishlist = false, 
  onWishlistToggle = () => {},
  showWishlist = true 
}: { 
  product: StandardProduct | DiscountProduct; 
  isDiscount?: boolean;
  isInWishlist?: boolean;
  onWishlistToggle?: (productId: string) => Promise<void> | void;
  showWishlist?: boolean;
}) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });
    const { addItem } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(isInWishlist);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    console.log("product", product)

    // Get product reviews
    const reviews = useQuery(api.resources.productReviews.list, {
      productId: product.id as Id<"products">,
      paginationOpts: { numItems: 50, cursor: null }
    });

      // Calculate average rating and total reviews
      const averageRating = reviews?.page?.length 
        ? reviews.page.reduce((sum, review) => sum + review.rating, 0) / reviews.page.length 
        : 0;
      const totalReviews = reviews?.page?.length || 0;
      
      // Function to render star rating
      const renderStarRating = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return (
          <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => (
              <StarIcon key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
            {hasHalfStar && (
              <div className="relative w-5 h-5">
                <StarIcon className="absolute w-5 h-5 text-gray-300 fill-current" />
                <div className="absolute w-1/2 h-full overflow-hidden">
                  <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
              </div>
            )}
            {[...Array(emptyStars)].map((_, i) => (
              <StarIcon key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({rating.toFixed(1)})
            </span>
          </div>
        );
      };

    // Update local state when prop changes
    useEffect(() => {
      setIsWishlisted(isInWishlist);
    }, [isInWishlist]);

    const handleWishlistToggle = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (isWishlistLoading) return;
      
      try {
        setIsWishlistLoading(true);
        await onWishlistToggle(product.id);
      } catch (error) {
        console.error('Error toggling wishlist:', error);
        toast.error('Failed to update wishlist');
      } finally {
        setIsWishlistLoading(false);
      }
    };

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      const price = 'price' in product ? product.price : 
                 'discountPrice' in product ? product.discountPrice : 0;
      
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: price || 0,
        image: product.image,
        quantity: 1
      };
      
      addItem(cartItem);
      
      toast.success(`${product.name} has been added to your cart.`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };
    
    return (
      <motion.div 
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative h-48">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              className="object-cover hover:opacity-90 transition-opacity"
            />
            {/* Discount Badge */}
            {isDiscount && 'discountPercent' in product && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {product.discountPercent}% OFF
              </div>
            )}
            
            {/* Wishlist Button */}
            {showWishlist && (
              <button
                onClick={handleWishlistToggle}
                disabled={isWishlistLoading}
                className={`absolute top-2 right-2 p-2 rounded-full ${
                  isWishlisted 
                    ? 'bg-red-50 text-red-500' 
                    : 'bg-white/90 text-gray-500 hover:text-red-500'
                } transition-colors duration-200 shadow-sm`}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart 
                  size={18} 
                  fill={isWishlisted ? 'currentColor' : 'none'}
                  className={isWishlistLoading ? 'animate-pulse' : ''}
                />
              </button>
            )}
          </div>
        </Link>
        <div className="p-4">
          <Link href={`/products/${product.id}`} className="hover:underline">
            <h3 className="font-bold text-lg">{product.name}</h3>
          </Link>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{product.description}</p>
          {isDiscount && 'originalPrice' in product && 'discountPrice' in product ? (
            <div className="flex items-center mb-1">
              <span className="text-gray-500 line-through mr-2">₦{product?.originalPrice?.toLocaleString()}</span>
              <span className="text-xl font-bold text-green-600">₦{product?.discountPrice?.toLocaleString()}</span>
            </div>
          ) : !isDiscount && 'price' in product ? (
            <div className="text-xl font-bold mb-1">₦{product.price.toLocaleString()}</div>
          ) : null}
          {isDiscount && 'endsIn' in product && (
            <div className="flex items-center text-xs text-orange-500 mb-2">
              <Clock size={14} className="mr-1" />
              <span>Ends in {product.endsIn}</span>
            </div>
          )}
           {totalReviews > 0 ? (
            <div className="mt-2">
              <div className="flex items-center">
                {renderStarRating(averageRating)}
                <span className="ml-2 text-sm text-gray-600">
                  ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-2 text-sm text-gray-500">No reviews yet</div>
          )}
          {!isDiscount && 'rating' in product && 'reviews' in product && (
            <div className="flex items-center mb-2">
              <div className="flex items-center mr-2">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="ml-1 text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-xs text-gray-500">({product.reviews} reviews)</span>
            </div>
          )}
          <Button 
            onClick={handleAddToCart}
            className="w-full mt-2 bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} />
            {isDiscount ? 'I want this' : 'I want this'}
          </Button>
        </div>
      </motion.div>
    );
  };
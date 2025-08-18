"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Share, Bookmark, MapPin, Eye, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Id } from "../../../../convex/_generated/dataModel"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

interface MasonryCardProps {
    id: Id<"listing">;
    title: string;
    description?: string;
    price: number;
    originalPrice?: number;
    condition: string;
    merchantId: string;
    category: string;
    featured?: boolean;
    images?: string[];
    address?: {
      city?: string;
      state?: string;
      region?: string;
      country?: string;
      postalCode?: string;
      street?: string;
    };
    isBooked?: boolean;
    isSold?: boolean;
    isNegotiable?: boolean;
    status?: string;
    _creationTime: number;
}

export function MasonryCard({
  title,
  id,
  images,
  price,
  condition,
  merchantId,
  address,
  isBooked,
  isSold,
  isNegotiable,
  status,
  _creationTime,
}: MasonryCardProps) {

  const userProfile = useQuery(api.resources.users.getById, { 
    id: merchantId as Id<"users">
  });

  const viewData = useQuery(api.resources.itemViews.getListingViews, {
    listingId: id
  }) || { totalViews: 0, uniqueViews: 0 };
  
  const { totalViews } = viewData;
  const truncatedTitle = title.length > 50 ? `${title.slice(0, 50)}...` : title;

  return (
    <Link href={`/item/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg border-none shadow-none transition-shadow duration-200 group">
        <div className="relative overflow-hidden">
          <img
            src={images?.[0] || "/placeholder.svg"}
            alt={title}
            className="w-full object-cover transition-transform duration-200 rounded-xl hover:rounded-xl group-hover:scale-105 min-h-[150px] max-h-[250px] md:max-h-[350px]"
            // style={{ height: imageHeight }}
          />
          <div className="absolute flex items-center top-1 left-2 gap-2">
            <Badge 
                variant="outline" 
                className={`text-xs top-[-14px] left-[-10px] ${
                  condition === 'new' ? 'border-blue-500 text-blue-500' :
                  condition === 'like-new' ? 'border-green-500 text-green-500' :
                  condition === 'good' ? 'border-amber-500 text-amber-500' :
                  condition === 'fair' ? 'border-orange-500 text-orange-500' :
                  'border-gray-500 text-gray-500'
                }`}
              >
                {condition}
            </Badge>
            {isBooked && (
              <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
                Booked
              </Badge>
            )}
            {isSold && (
              <Badge variant="default" className="bg-red-500 hover:bg-red-600">
                Sold
              </Badge>
            )}
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                <Bookmark className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="flex absolute bottom-1 right-1 items-center gap-3">
            <div className="flex items-center bg-[#045838a8] text-white rounded-full px-2 py-0 gap-1">
              <Eye className="h-4 w-4" />
              <span>{totalViews}</span>
            </div>
          </div>
        </div>

        <div className="">
          <div className="px-2">
            <CardTitle className=" mt-[-14px] text-sm sm:font-medium font-inter font-normal leading-tight">{truncatedTitle}</CardTitle>
            <div className="flex items-center justify-between">
              <CardDescription className="text-lg font-bold text-[#088b56]">{formatPrice(price)}</CardDescription>
            </div>
          </div>

          <div className="px-2 py-4">
            <div className="flex items-center text-sm mt-[-10px] text-gray-500 dark:text-gray-400 mb-2">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {[
                    address?.city,
                    address?.region,
                    address?.state,
                    address?.country
                  ].filter(Boolean).join(', ') || 'Location not specified'}
                </span>
              </div>

            <div className="flex items-center mb-[-12px] mt-[-5px] justify-between text-sm text-muted-foreground">
              {
                userProfile?.name && (
                  <span className="max-w-[150px] flex items-center overflow-hidden text-ellipsis">
                    <User className="w-4 h-4 mr-1 flex-shrink-0" />
                    {userProfile?.name}
                  </span>
                )
              }
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

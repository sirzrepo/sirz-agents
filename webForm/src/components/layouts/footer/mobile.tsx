'use client';

import React from 'react';
import { Bell, Heart, Search, User, MessageSquare, Home, ShoppingCart, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { useUnreadNotifications } from '@/services/useUnreadNotifications';
import { useCart } from '@/contexts/CartContext';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Id } from '../../../../convex/_generated/dataModel';

 interface IUser {
  _id: Id<"users">;
  _creationTime: number;
  name?: string;
  email?: string;
  phone?: string;
  emailVerificationTime?: number;
  approvalStatus?: string;
  verified?: boolean;
  image?: string;
}

export default function MobileFooter() {
  const pathname = usePathname();
  const user = useQuery(api.resources.users.authenticated) as IUser | null;
  const { unreadCount } = useUnreadNotifications();
  const { itemCount } = useCart();

  const avatarIcon = user && user.image ? (
    <Avatar>
      <AvatarImage src={user.image} />
      <AvatarFallback>{user.name?.charAt(0) ?? ""}</AvatarFallback>
    </Avatar>
  ) : (
    <div className="w-8 h-8 relative rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
      <User size={18} />
    </div>
  );
  
  const content = [
    {
      icon: <Home size={22} />,
      title: "Home",
      url: "/"
    },
    {
      icon: <Search size={22} />,
      title: "Browse",
      url: "/listings"
    },
    ...(user ? [
      {
        icon: avatarIcon,
        title: "Profile",
        url: "/profile"
      },
      
    ] : [
      {
        icon: <User size={22} />,
        title: "Login",
        url: "/auth/login"
      },
    ]),
    {
      icon: <Plus size={22} />,
      title: "Sell",
      url: "/sell"
    },
    {
      id: 5,
      icon: <div className="relative">
        <Bell size={22} />
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </div>,
      title: "Notifications",
      url: "/notifications"
    },
  ];

  return (
    <div 
    >
      <div className="flex items-center justify-between px-2">
        {content.map((item) => (
          <Link 
            href={item.url}
            key={item.title} 
            className={`${pathname === item.url || (item.url !== '/' && pathname.startsWith(item.url)) ? 'text-primary-500' : 'text-gray-500'} hover:text-primary-500 transition-colors flex flex-col items-center gap-1 py-3 px-2 w-full`}
          >
            <div className={`hover:text-primary-500 transition-colors`}>
              {item.icon}
            </div>
            <div className="text-[10px] ">
              {item.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

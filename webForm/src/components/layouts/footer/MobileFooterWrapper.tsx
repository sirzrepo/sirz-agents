'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import MobileFooter from './mobile';

export default function MobileFooterWrapper() {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const [isVisible, setIsVisible] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolling up or down
      if (currentScrollY > scrollY + 10) {
        // Scrolling down - hide the footer
        setIsVisible(false);
      } else if (currentScrollY < scrollY - 10) {
        // Scrolling up - show the footer
        setIsVisible(true);
      }
      
      // Update scroll position
      setScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);
  
  if (isAuthPage) {
    return null;
  }
  
  return (
    <div 
      className={`fixed bottom-0 left-0 dark:bg-gray-900 bg-white right-0 z-50 border-t dark:border-gray-600 border-gray-200 shadow-lg sm:hidden transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <MobileFooter />
    </div>
  );
} 
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './layouts/Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  
  if (isAuthPage) {
    return null;
  }
  
  return <Navbar />;
} 
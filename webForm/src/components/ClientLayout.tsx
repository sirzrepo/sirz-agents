'use client';

import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import { ProtectedRoute } from './ProtectedRoute';
import Navbar from './layouts/Navbar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        {!isAuthPage && <Navbar />}
        <main className={`flex-grow ${!isAuthPage ? 'container mx-auto px-4 py-8' : ''}`}>
          {children}
        </main>
        <ToastContainer position="bottom-right" />
      </div>
    </ProtectedRoute>
  );
} 
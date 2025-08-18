'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Loader from '@/features/loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useQuery(api.resources.users.authenticated);
  const isLoading = user === undefined;
  const isAuthenticated = !!user;

  const router = useRouter();
  const pathname = usePathname();

  const isAuthPath = useMemo(() => pathname?.startsWith('/auth/'), [pathname]);
  const isProtectedPath = useMemo(
    () => pathname === '/profile' || pathname === '/sell',
    [pathname]
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated && isProtectedPath) {
      router.push(`/auth/login?from=${encodeURIComponent(pathname || '')}`);
    }
  }, [isAuthenticated, isLoading, router, pathname, isProtectedPath]);

  // Always allow access to auth routes
  if (isAuthPath) return <>{children}</>;

  // Show loader while user info is loading on protected routes
  if (isLoading && isProtectedPath) return (
    <div className="min-h-screen bg-gray-50">
        <Loader />
    </div>
  );

  // Block rendering protected content if unauthenticated
  if (!isAuthenticated && isProtectedPath) return null;

  // Allow all other cases
  return <>{children}</>;
}

'use client';

import Loader from '@/features/loader';
import { ReactNode, useEffect, useState } from 'react';

export default function ClientOnly({ children }: { children: ReactNode }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        // Return a minimal placeholder during static generation
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse">
                    <Loader />
                </div>
            </div>
        );
    }

    return <>{children}</>;
} 
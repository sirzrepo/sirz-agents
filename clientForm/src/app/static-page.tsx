'use client';

import { ReactNode } from 'react';
import ClientOnly from '@/components/ClientOnly';

export default function StaticPage({ children }: { children: ReactNode }) {
    return (
        <ClientOnly>
            {children}
        </ClientOnly>
    );
} 
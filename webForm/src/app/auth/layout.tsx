'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="min-h-screen ">
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div onClick={() => router.push('/')} className="sm:mx-auto mb-3 sm:w-full sm:max-w-md">
          <Image
            className="mx-auto h-12 cursor-pointer w-auto"
            src="/images/logo.png"
            alt="description"
            width={500}
            height={500}
          />
        </div>
        {children}
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}
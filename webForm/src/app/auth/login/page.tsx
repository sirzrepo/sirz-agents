'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Loader2, Eye, EyeOff, Lock } from 'lucide-react';
import { ConvexError } from "convex/values";
import { useQuery, useAction, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import EmailLink from '../emailLink';
import PasswordLoginPage from './passwordLogin';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  // Client-side state
  const [isClientReady, setIsClientReady] = useState(false);
  const [loginType, setLoginType] = useState('password');
  const router = useRouter();

  // Use Convex auth action
  const signInAction = useAction(api.auth.signIn);
  const user = useQuery(api.resources.users.authenticated);
  
  // Set client-side rendering flag after mount
  useEffect(() => {
    setIsClientReady(true);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      // router.push('/');
    }
  }, [user, router]);

  // If client-side rendering is not ready yet, show a minimal loading state
  if (!isClientReady) {
    return (
      <div className="max-w-md mx-auto p-6 w-full sm:bg-white sm:dark:bg-gray-800 rounded-lg sm:shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Loading...</h1>
        <div className="flex justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 w-full sm:bg-white sm:dark:bg-gray-800 rounded-lg sm:shadow-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center">Welcome back to REKOBO</h1>
        <p className="text-center text-sm text-gray-600 italic dark:text-gray-400">Sell fast, buy fast, trade fast, with Uncle Reuben</p>
      </div>

      {/* <Button
        variant="outline"
        className="w-full h-12 bg-primary-100 hover:bg-primary-400 text-primary-600 mb-6"
        onClick={() => setLoginType(loginType === 'password' ? 'email' : 'password')}
      >
        <Lock className="w-5 h-5 mr-2" />
        { loginType === 'password' ? 'Sign in with email' : 'Sign in with password' }
      </Button> */}

      <PasswordLoginPage /> 

      {/* {loginType === 'password' ? <PasswordLoginPage /> : <EmailLink />} */}
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-medium text-primary-600 hover:text-primary-500">
          Join Us Now!
          </Link>
        </p>
      </div>
    </div>
  );
}


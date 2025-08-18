'use client';

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import DeviceFingerprint from "@/features/deviceFingerPrint";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/features/loader";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const { logout: authLogout } = useAuth();
  const router = useRouter();
  const [fingerprint, setFingerprint] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const user = useQuery(api.resources.users.authenticated);
  
  const deviceFingerprint = useQuery(api.resources.deviceFingerPrint.getByFingerprint,{
     fingerprint: fingerprint
    });
    
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      setIsLoading(true);
      await signIn("password", formData);
      
      // Wait for the user query to update after login
      await new Promise(resolve => setTimeout(resolve, 2000)); // Small delay to ensure user data is fetched
      
      // After sign in, check if user's email is verified
      if (!user?.emailVerificationTime) {
        // If email is not verified, sign out the user
        // authLogout();
        alert("Please verify your email before logging in");
        router.push(`/auth/verify-otp?email=${email}`);
      } else {
        router.push("/");
      }

    } catch (err) {
      console.error("Sign-in error:", err);
      // Display error message to user
      let message = "Login failed. Please check your credentials and try again.";
      if (err instanceof Error && err.message) {
        // You can optionally whitelist known error messages
        if (err.message.includes("InvalidSecret")) {
          message = "Incorrect email or password.";
        } else if (err.message.includes("InvalidAccountId")) {
          message = "No account found with that email.";
        } else {
          message = err.message; // optionally show raw message
        }
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <DeviceFingerprint onFingerprint={(id) => setFingerprint(id)} />
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password" 
              type={showPassword ? "text" : "password"}
              // value={password}
              // onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white pr-10"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <Link href="/auth/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </Link>
          </div>
        </div>

      <input name="flow" value="signIn" type="hidden" />
      <button 
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        type="submit">Sign in
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {
      isLoading && (
        <Loader />
      )
    }
    </form>
  );
}
'use client';

import OtpInput from "@/components/ui/otpInput";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

function VerifyOTPContent() {
   const [otp, setOtp] = useState('');
   const { signIn } = useAuthActions();
   const router = useRouter();
   const searchParams = useSearchParams();
   const [email, setEmail] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);


     // Get email from URL query params
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
    // Start countdown when component mounts
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [searchParams]);

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setIsResending(true);
    try {
      // Use Convex auth to resend the OTP
      const formData = new FormData();
      formData.set('email', email);
      formData.set("password", sessionStorage.getItem("tempPassword") || "");
      formData.set('flow', 'signIn'); // or 'signUp' depending on the flow
      
      // This will trigger the ResendOTP provider to send a new OTP
      await signIn('password', formData);
      
      // Reset the countdown
      setCountdown(120);
      setCanResend(false);
      
      // Start the countdown timer again
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      toast.success('A new verification code has been sent to your email');
    } catch (error) {
      console.error('Failed to resend OTP:', error);
      toast.error('Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  console.log("email+++++", email)

  useEffect(() => {
    // Only redirect if we've checked for the email param and it's still not available
    // This prevents immediate redirection when the page first loads
    const emailParam = searchParams.get('email');
    if (!emailParam && !email) {
      toast.error('Email is missing. Please try to sign up again.');
      router.back();
    }
  }, [email, router, searchParams]);


    const handleOtpChange = (value: string) => {
      setOtp(value);
    };

    const handleVerification = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      formData.set("code", otp);
      try {
        await signIn("password", formData);
  
        const signInForm = new FormData();
        signInForm.set("email", email);
        signInForm.set("password", sessionStorage.getItem("tempPassword") || "");
        signInForm.set("flow", "signIn");
  
        await signIn("password", signInForm);
        router.push("/");
      } catch (err) {
        console.error("Verification error:", err);
        setError("Invalid verification code or expired code");
      } finally {
        setIsLoading(false);
      }
    };
  return (

     <div className="max-w-md mx-auto p-6 sm:bg-white sm:dark:bg-gray-800 rounded-lg sm:shadow-md">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-center">Verify your email</h1>
            <p className="text-center text-sm text-gray-600 italic dark:text-gray-400">Enter the verification code sent to your email</p>
          </div>
  
          <form onSubmit={handleVerification} className="space-y-4">
              <OtpInput length={6} onChange={handleOtpChange} />
              <div className="flex justify-between items-center mt-2 text-sm">
                {!canResend ? (
                  <span className="text-gray-600 dark:text-gray-400">
                    Resend OTP in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                  </span>
                ) : (
                  <span className="text-gray-600 dark:text-gray-400">Didn&apos;t receive code?</span>
                )}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={!canResend || isResending}
                  className={`text-primary-600 hover:text-primary-700 font-medium ${
                    (!canResend || isResending) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isResending ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>
  
              <input name="email" value={email} type="hidden" />
              <input name="flow" value="email-verification" type="hidden" />
              <div className="mt-6 flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Verifying code...
                    </>
                  ) : (
                    'Verify code'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
              {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </form>
      </div> 
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg sm:shadow-md">
        <div className="flex justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary-600" />
        </div>
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}
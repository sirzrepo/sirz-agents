'use client'
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Loader from "@/features/loader";

export default function EmailVerification() {
    const { verifyOTP, resendOTP } = useAuth();
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading] = useState(false);
   const searchParams = useSearchParams();
   const email = searchParams.get('email');
    
    // useEffect(() => {
    //   if (typeof window !== "undefined") {
    //     const params = new URLSearchParams(window.location.search);
    //      const email = params.get('email');
    //      setEmail(email || '');
    //   }
    // }, [useSearchParams]);

  // ✅ Redirect belongs in useEffect
  useEffect(() => {
    if (!email) {
      router.replace("/auth/login");
    }
  }, [email, router]);

   if (!email) return null; // prevents render flash

    // const email = ""


    const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      console.log("email, otp", email, otp)
      await verifyOTP(email, otp);
      router.push('/');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleResendOTP = async () => {
    if (!email) return;
    
    try {
      await resendOTP(email);
      setMessage('New verification code sent successfully!');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to resend verification code');
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 1) return;
  
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp.join(''));
  
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };
  
  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number): void => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };
  
    return (
      <div className="bg-colorLight dark:bg-colorDark flex justify-center sm:items-center items-end py-10 bg-dashboard-form-gradient min-h-screen">
        <div className="max-w-md md:w-[60%] w-[95%] bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
            <p className="text-gray-600 mb-8">Enter the verification code sent to your email</p>
          </div>
  
          {message && (
            <div className={`mb-4 p-4 rounded ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
  
          <form className="space-y-6" onSubmit={handleOTPSubmit}>
            <div className="flex justify-center space-x-2">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={otp[index] || ''}
                  onChange={(e) => handleOTPChange(e, index)}
                  onKeyDown={(e) => handleBackspace(e, index)}
                />
              ))}
            </div>
  
            <Button type="submit" className='bg-blue-500 hover:bg-blue-700' disabled={isLoading}>
              {isLoading ? <Loader /> : 'Verify Email'}
            </Button>
  
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-sm text-primary-600 hover:text-primary-500"
                disabled={isLoading}
              >
                Resend verification code
              </button>
            </div>
          </form>
        </div>
      </div>
    );

}
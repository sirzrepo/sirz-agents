
'use client'
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
   const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const router = useRouter();
  const { resetPassword, resendOTP } = useAuth();

  console.log(email)

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (!email) return;
    
    try {
      await resendOTP(email);
      setMessage({ 
        text: 'New verification code sent successfully!', 
        type: 'success' 
      });

        // Start cooldown timer (60 seconds)
      let cooldown = 60;
      setResendCooldown(cooldown);
      
      const timer = setInterval(() => {
        cooldown -= 1;
        setResendCooldown(cooldown);
        
        if (cooldown <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    } catch (err: any) {
      setMessage({ 
        text: err.response?.data?.message || 'Failed to resend verification code', 
        type: 'error' 
      });
    }
  };

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

    // Add this effect to clear the interval when component unmounts
  useEffect(() => {
    return () => {
      // Clean up the interval when component unmounts
      setResendCooldown(0);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    if (password.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setMessage({ text: 'Please enter a valid 6-digit OTP', type: 'error' });
      return;
    }

    if (!email) {
      setMessage({ text: 'Email is required', type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      
      // If OTP is verified, reset the password
      await resetPassword(email, otpString, password);
      
      setMessage({ 
        text: 'Password has been reset successfully! Redirecting to login...', 
        type: 'success' 
      });
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error: any) {
      setMessage({ 
        text: error.response?.data?.message || 'Error resetting password', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-colorLight dark:bg-colorDark py-10 bg-dashboard-form-gradient min-h-screen">
      <div className="sm:w-[60%] lg:w-[40%] w-[90%] m-auto flex items-center justify-center mt-10">
        <form onSubmit={handleSubmit} className="py-12 px-12 mt-10 border-b-[6px] border-e-[7px] border-colorGreen rounded-xl bg-white dark:bg-colorDefaultDark w-full">
          <section>
            <div className="flex justify-center items-center mb-10">
              <Image src={`/logo.svg`} alt="Logo" width={100} height={100} />
            </div>

            <div className="text-center mb-7">
              <h1 className="text-[25px] font-bold font-Helvetica mb-6">Reset Your Password</h1>
              <p>Enter the verification code sent to your email and your new password.</p>
            </div>

            {message.text && (
              <div className={`mb-4 p-4 rounded ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
                Verification Code
              </label>
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOTPChange(e, index)}
                    onKeyDown={(e) => handleBackspace(e, index)}
                    className="w-12 h-12 text-center text-lg border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    disabled={isLoading}
                  />
                ))}
              </div>
              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || isLoading}
                  className={`text-sm ${
                    resendCooldown > 0 ? 'text-gray-500' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  {resendCooldown > 0 
                    ? `Resend code in ${resendCooldown}s` 
                    : "Didn't receive a code? Resend"}
                </button>
              </div>
            </div>

            <div className="relative pt-2 mb-6">      
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:bg-colorDefaultDark rounded-lg bg-tranparent dark:bg-background_dark placeholder:text-[12px] focus:outline-none focus:ring-1 dark:focus:ring-secondary focus:border-none focus:ring-primary"
                placeholder="Enter new password"
                required
                minLength={6}
                disabled={isLoading}
              />
              <div className="absolute top-0 left-3 bg-white px-2 text-[12px] text-zinc-500 font-comfortaa dark:bg-colorDefaultDark">
                New Password
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-3 top-0 bottom-0 text-2xl text-gray-500"
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative pt-2 mb-8">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:bg-colorDefaultDark rounded-lg bg-tranparent dark:bg-background_dark placeholder:text-[12px] focus:outline-none focus:ring-1 dark:focus:ring-secondary focus:border-none focus:ring-primary"
                placeholder="Confirm new password"
                required
                minLength={6}
                disabled={isLoading}
              />
              <div className="absolute top-0 left-3 bg-white px-2 text-[12px] text-zinc-500 font-comfortaa dark:bg-colorDefaultDark">
                Confirm Password
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute cursor-pointer right-3 top-0 bottom-0 text-2xl text-gray-500"
                disabled={isLoading}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="max-sm:m-auto flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isLoading}
                onClick={() => {}}
              >
                Reset Password
              </Button>
              <button
                type="button"
                onClick={() => router.push('/auth/login')}
                className="text-blue-600 hover:text-blue-700 text-sm text-center"
                disabled={isLoading}
              >
                Back to Login
              </button>
            </div>
          </section>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;

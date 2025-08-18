'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAction } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import OtpInput from '@/components/ui/otpInput';

const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: "At least 8 characters long" },
  { regex: /[0-9]/, text: "Contains at least one number" },
  { regex: /[a-z]/, text: "Contains at least one lowercase letter" },
  { regex: /[A-Z]/, text: "Contains at least one uppercase letter" },
  { regex: /[^A-Za-z0-9]/, text: "Contains at least one special character" }
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  
  // Check for stored email on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('passwordResetEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      setShowResetForm(true);
      setIsSubmitted(true);
    }
  }, []);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  
  const router = useRouter();
  const { login } = useAuth();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError(null);
    return true;
  };

  const signIn = useAction(api.auth.signIn);


  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    if (!validateEmail(email)) {
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Store the email in localStorage for the reset flow
      localStorage.setItem('_passwordResetEmail', email);
      
      // Trigger the password reset flow
      await signIn({
        provider: "password",
        params: {
          email,
          flow: "reset"
        }
      });
      
      // If we get here, the reset email was sent successfully
      setSuccess('Password reset code has been sent to your email');
      setShowResetForm(true); // Show the OTP input form
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // If there's an error, reset the form state
      setIsSubmitted(false);
      setShowResetForm(false);
    } finally {
      setIsLoading(false);
    }
  };

    const handleOtpChange = (value: string) => {
      setOtp(value);
    };


  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate password requirements
    const passwordErrors = PASSWORD_REQUIREMENTS.filter(req => !req.regex.test(newPassword));
    if (passwordErrors.length > 0) {
      setError("Password does not meet the requirements");
      return;
    }
    
    if (!otp || otp.length < 6) {
      setError("Please enter a valid verification code");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);

    try {
      // Send parameters as a plain object for Convex
      await signIn({
        provider: "password",
        params: {
          email,
          code: otp,
          newPassword,
          flow: 'reset-verification'
        }
      });
      
      // If successful, clear the stored email and redirect to login
      localStorage.removeItem('passwordResetEmail');
      toast.success("Password reset successful! You can now log in with your new password.");
      router.push('/auth/login');
    } catch (error) {
      console.error("Password reset failed:", error);
      localStorage.removeItem('passwordResetEmail');
      const errorMessage = error instanceof Error ? error.message : "Failed to reset password. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      localStorage.removeItem('passwordResetEmail');
      setIsLoading(false);
    }
  };

  if (isSubmitted && !showResetForm) {
    return (
      <div className="max-w-md mx-auto p-6 w-full bg-white dark:bg-gray-800 rounded-lg sm:shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2">Check Your Email</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          We&apos;ve sent password reset instructions to {email}
        </p>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Didn&apos;t receive the email? Check your spam folder or
          </p>
          <button
            type="button"
            className="mt-2 text-sm text-primary-600 hover:text-primary-500"
            onClick={() => setIsSubmitted(false)}
          >
            Try another email address
          </button>
        </div>

        <div className="text-center mt-4">
          <Link
            href="/auth/login"
            className="text-sm text-gray-600 hover:text-primary-500"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (showResetForm) {
    return (
      <div className="max-w-md mx-auto p-6 w-full bg-white dark:bg-gray-800 rounded-lg sm:shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2">Reset Your Password</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Enter the code sent to your email and your new password
        </p>

        <form className="space-y-4" onSubmit={handleResetPassword}>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            6-Digit Reset Code
            </label>

            <OtpInput length={6} onChange={handleOtpChange} />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white pr-10"
                placeholder="Enter your new password"
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
            <div className="mt-2">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white pr-10"
                placeholder="Confirm your new password"
              />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <p>Password must:</p>
              <ul className="list-disc pl-5 mt-1">
                {PASSWORD_REQUIREMENTS.map((req, index) => (
                  <li 
                    key={index} 
                    className={req.regex.test(newPassword) ? 'text-green-600' : 'text-gray-500'}
                  >
                    {req.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-gray-600 hover:text-primary-500"
            >
              Return to Sign In
            </Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 w-full bg-white dark:bg-gray-800 rounded-lg sm:shadow-md">
      <h1 className="text-2xl font-bold text-center mb-2">Forgot Your Password?</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        Enter your email address and we&apos;ll send you instructions to reset your password
      </p>

      <form className="space-y-4" onSubmit={handleRequestReset}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) validateEmail(e.target.value);
              }}
              className={`w-full px-3 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white`}
              placeholder="Enter your email address"
            />
            {error && (
              <div className="absolute right-0 top-0 flex h-full items-center pr-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Sending code...
              </>
            ) : (
              'Send code'
            )}
          </button>
        </div>

        <div className="text-center">
          <Link
            href="/auth/login"
            className="text-sm text-gray-600 hover:text-primary-500"
          >
            Return to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}







// reset password
// import { useAuthActions } from "@convex-dev/auth/react";
// import { useState } from "react";
 
// export default function PasswordLoginPage() {
//   const { signIn } = useAuthActions();
//   const [step, setStep] = useState<"forgot" | { email: string }>("forgot");
//   return step === "forgot" ? (
//     <form
//       onSubmit={(event) => {
//         event.preventDefault();
//         const formData = new FormData(event.currentTarget);
//         void signIn("password", formData).then(() =>
//           setStep({ email: formData.get("email") as string })
//         );
//       }}
//     >
//       <input name="email" placeholder="Email" type="text" />
//       <input name="flow" type="hidden" value="reset" />
//       <button type="submit">Send code</button>
//     </form>
//   ) : (
//     <form
//       onSubmit={(event) => {
//         event.preventDefault();
//         const formData = new FormData(event.currentTarget);
//         void signIn("password", formData);
//       }}
//     >
//       <input name="code" placeholder="Code" type="text" />
//       <input name="newPassword" placeholder="New password" type="password" />
//       <input name="email" value={step.email} type="hidden" />
//       <input name="flow" value="reset-verification" type="hidden" />
//       <button type="submit">Continue</button>
//       <button type="button" onClick={() => setStep("forgot")}>
//         Cancel
//       </button>
//     </form>
//   );
// }

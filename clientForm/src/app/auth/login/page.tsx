'use client'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Loader from '../../../features/loader';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Login = () => {
  const router = useRouter();
  const { login, isLoading, error, resendOTP } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setMessage(err.response?.data?.message || "failed to login, check your credentials and ensure you have the right permissions");
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await resendOTP(email);
      console.log("email", email)
      router.push(`/auth/verify-email?email=${email}`);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to resend OTP');
      console.log(err.response?.data?.message || 'Failed to resend OTP')
    }
  };

  console.log(error)

  return (
    <section className="bg-colorLight dark:bg-colorDark py-10 bg-dashboard-form-gradient min-h-screen">
      <div className="sm:w-[60%] lg:w-[40%] w-[90%] m-auto flex sm:items-center items-end justify-center mt-10">
        <form onSubmit={handleSubmit} className="py-12 px-12 mt-10 border-b-[6px] border-e-[7px] border-colorGreen rounded-xl bg-white dark:bg-colorDefaultDark">
          <section className="">
            <div className="flex justify-center items-center mb-10">
              <Image src={"/logo.svg"} alt="Logo" width={100} height={100} />
            </div>

            <div className="text-center mb-7">
              <h1 className="text-[25px] font-bold font-Helvetica mb-6">Welcome to your SIRz Portal</h1>
              <p>Please enter your credentials</p>
            </div>

            {message && (
              <div className="mb-4 p-4 text-sm rounded bg-red-100 text-red-700">
                {message}
              </div>
            )}

            <div className="relative pt-2 mb-8">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:bg-colorDefaultDark rounded-lg bg-tranparent dark:bg-background_dark placeholder:text-[12px] focus:outline-none focus:ring-1 dark:focus:ring-secondary focus:border-none focus:ring-primary"
                placeholder="Enter your email"
                required
              />
              <div className="absolute top-0 left-3 bg-white px-2 text-[12px] text-zinc-500 font-comfortaa dark:bg-colorDefaultDark">
                Email address
              </div>
            </div>

            <div className="relative pt-2 mb-8">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:bg-colorDefaultDark rounded-lg bg-tranparent dark:bg-background_dark placeholder:text-[12px] focus:outline-none focus:ring-1 dark:focus:ring-secondary focus:border-none focus:ring-primary"
                placeholder="Enter your password"
                required
              />
              <div className="absolute top-0 left-3 bg-white px-2 text-[12px] text-zinc-500 font-comfortaa dark:bg-colorDefaultDark">
                Password
              </div>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)} // Toggle the password visibility
                className="absolute cursor-pointer right-3 top-0 bottom-0 text-2xl text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show/Hide Icon */}
              </button>
            </div>

            {isLoading ? (
              <Loader />
            ) : error === "Please verify your email first" ? (
              <div className="max-sm:m-auto flex justify-center">
                <Button
                  type="button"
                  onClick={handleVerifyEmail}
                  className="w-full bg-red-600 text-sm text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                   Verify Your Email
                </Button> 
              </div>
            ) : (
              <div className="max-sm:m-auto flex justify-center">
                <Button
                  type="submit"
                  onClick={() => {}}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                >
                   Sign In
                </Button> 
              </div>
            )}

            <div className="text-center mt-4">
              Don&apos;t have an account? 
              <a href="/auth/register" className="text-blue-600 ps-2 font-bold italic hover:text-blue-700">
                Sign up
              </a>
            </div>
            <div className="text-center mt-2">
              <a href="/auth/forgot-password" className="text-blue-600 hover:text-blue-700 text-sm">
                Forgot password?
              </a>
            </div>
          </section>
        </form>
      </div>
    </section>
  );
};

export default Login;


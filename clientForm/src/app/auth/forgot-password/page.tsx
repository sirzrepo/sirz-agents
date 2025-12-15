'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/features/loader';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const { forgotPassword, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      await forgotPassword(email);
      router.push(`/auth/reset-password?email=${email}`);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error requesting password reset');
    }
  };

  console.log(error)

  return (
    <section className="bg-colorLight dark:bg-colorDark py-10 bg-dashboard-form-gradient min-h-screen">
      <div className="sm:w-[60%] lg:w-[40%] w-[90%] m-auto flex items-center justify-center mt-10">
        <form onSubmit={handleSubmit} className="py-12 px-12 mt-10 border-b-[6px] border-e-[7px] border-colorGreen rounded-xl bg-white dark:bg-colorDefaultDark w-full">
          <section>
            <div className="flex justify-center items-center mb-10">
              <Image src={`/logo.svg`} alt="Logo" />
            </div>

            <div className="text-center mb-7">
              <h1 className="text-[25px] font-bold font-Helvetica mb-6">Reset Your Password</h1>
              <p>Enter your email address and we&apos;ll send you a link to reset your password.</p>
            </div>

            {message && (
              <div className={`mb-4 p-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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

            {isLoading ? (
              <Loader />
            ) : (
              <div className="max-sm:m-auto flex flex-col gap-4">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => {}}
                >
                  Send Reset Link
                </Button>
                <button
                  type="button"
                  onClick={() => router.push('/auth/login')}
                  className="text-blue-600 hover:text-blue-700 text-sm text-center"
                >
                  Back to Login
                </button>
              </div>
            )}
          </section>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;

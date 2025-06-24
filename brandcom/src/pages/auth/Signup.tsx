import { useState } from 'react';
// import { FiMail, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/ui/Button';
// import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../features/loader';
import { SirzLogo } from '../../assets';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const navigate = useNavigate();
  const { register, verifyOTP, resendOTP, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); 

  console.log(error)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await register(email, password);
      setUserId(response.userId);
      setShowOTPForm(true);
      setMessage('Registration successful! Please check your email for the verification code.');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      await verifyOTP(userId, otp);
      navigate('/');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleResendOTP = async () => {
    if (!userId) return;
    
    try {
      await resendOTP(userId);
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
  
  if (showOTPForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-600 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
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
  
            <Button type="submit" className='bg-blue-500 hover:bg-blue-700' variant="primary" fullWidth size="lg" disabled={isLoading}>
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
  

  return (
    <section className="bg-colorLight dark:bg-colorDark py-10 bg-dashboard-form-gradient min-h-screen">
      <div className="sm:w-[60%] md:w-[50%] lg:w-[30%] w-[90%] m-auto flex items-center justify-center mt-10">
      <form onSubmit={handleSubmit} className="py-12 px-12 mt-10 border-b-[6px] border-e-[7px] border-colorGreen rounded-xl bg-white dark:bg-colorDefaultDark">
          <section className="">
            <div className="flex justify-center items-center mb-10">
              <img src={SirzLogo} alt="Logo" />
            </div>

            <div className="text-center mb-7">
              <h1 className="text-[25px] font-bold font-Helvetica mb-6">Welcome to your SIRz Portal</h1>
              <p>Please enter your credentials</p>
            </div>

            {message && (
              <div className="mb-4 p-4 rounded bg-red-100 text-red-700">
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

            <div className="relative pt-2 mb-8">
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:bg-colorDefaultDark rounded-lg bg-tranparent dark:bg-background_dark placeholder:text-[12px] focus:outline-none focus:ring-1 dark:focus:ring-secondary focus:border-none focus:ring-primary"
                placeholder="Enter your password"
                required
              />
              <div className="absolute top-0 left-3 bg-white px-2 text-[12px] text-zinc-500 font-comfortaa dark:bg-colorDefaultDark">
                Password
              </div>
            </div>

            {isLoading ? (
              <Loader />
            ) : (
              <div className="max-sm:m-auto flex justify-center">
                <Button
                  type="submit"
                  onClick={() => {}}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </Button>
              </div>
            )}

            <div className="text-center mt-4">
              <a href="/login" className="text-primary-600 hover:text-primary-700">
              Already have an account? login
              </a>
            </div>
          </section>
        </form>
      </div>
    </section>
  );
};

export default Signup;
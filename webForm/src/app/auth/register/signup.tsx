'use client';

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import DeviceFingerprint from "@/features/deviceFingerPrint";
import { Id } from "../../../../convex/_generated/dataModel";

const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[0-9]/, text: "One number wey go make am complete" },
  { regex: /[a-z]/, text: "One capital letter atleast (big letter sharp!)" },
  { regex: /[A-Z]/, text: "One small letter atleast (to confuse dem haters)" },
  { regex: /[^A-Za-z0-9]/, text: "One special character wey go spice am up" }
];

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  [key: string]: string | undefined;
}

interface deviceFingerprint {
  fingerprint: string;
  userId: Id<"users">;
}

export default function SignUp() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+234');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [fingerprint, setFingerprint] = useState('');
  const [error, setError] = useState('');

  console.log("fingerprint", fingerprint)

 

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roles = useQuery(api.resources.roles.listAll, {})



  const validateEmail = (email: string): boolean => {
    if (!email) {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: undefined }));
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setErrors(prev => ({ ...prev, password: "Password is required" }));
      return false;
    }
    
    let isValid = true;
    const newErrors: FormErrors = {};
    
    PASSWORD_REQUIREMENTS.forEach(requirement => {
      if (!requirement.regex.test(password)) {
        newErrors.password = requirement.text;
        isValid = false;
      }
    });
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const validateConfirmPassword = (confirmPassword: string): boolean => {
    if (!confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Please confirm your password" }));
      return false;
    }
    
    if (confirmPassword !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      return false;
    }
    
    setErrors(prev => ({ ...prev, confirmPassword: undefined }));
    return true;
  };

  const addUser = useAction(api.resources.users.addUserAccount);
  const trackDevice = useMutation(api.resources.deviceFingerPrint.upsertDeviceFingerprint);

  const deviceFingerprint = useQuery(api.resources.deviceFingerPrint.getByFingerprint,{
    fingerprint: fingerprint
  });
  
  console.log("deviceFingerprint", deviceFingerprint)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      setIsLoading(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const emailValue = formData.get("email") as string;
    const phoneValue = formData.get("phone") as string;
    const countryCodeValue = formData.get("countryCode") as string;
    const passwordValue = formData.get("password") as string;
    
    setEmail(emailValue);
    setPhone(phoneValue);
    setCountryCode(countryCodeValue);
    
    // Store password temporarily for auto-login after verification
    sessionStorage.setItem("tempPassword", passwordValue);

    try {
      // Create user account with the default 'user' role
      const user = await addUser({
        name: emailValue.split('@')[0], // Use email prefix as name
        email: emailValue,
        password: passwordValue,
        confirmPassword: passwordValue,
        phone: `${countryCodeValue}${phoneValue}`,
        username: emailValue.split('@')[0],
        affiliated: false,
        // roleName will default to 'user' in the backend
        internalRequest: true // Bypass auth check since we're handling it here
      });

      console.log("user", user);

      if (user?._id) {
        await trackDevice({ fingerprint, userId: user._id });
      }

      // Trigger email verification
      const signInForm = new FormData();
      signInForm.set("email", emailValue);
      signInForm.set("password", passwordValue);
      signInForm.set("flow", "signUp");
      
      await signIn("password", signInForm);
      router.push(`/auth/verify-otp?email=${emailValue}`);
    } catch (err) {
      console.error("Sign-up error:", err);
      // Handle specific error cases here if needed
      setError("Sign-up failed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (deviceFingerprint) {
    return (
      <div className="text-red-600 text-sm">
        This device has already been used to create an account. Please log in instead or contact support if you believe this is a mistake.
      </div>
    );
  }
  

  return (
    <div className="">
       {/* Capture fingerprint once on load */}
      <DeviceFingerprint onFingerprint={(id) => setFingerprint(id)} />
          <form onSubmit={handleSubmit} className="space-y-4">
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
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <div className="flex rounded-md shadow-sm">
                  <select
                    name="countryCode"
                    className="block w-24 rounded-l-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 text-sm"
                    defaultValue="+234"
                    required
                  >
                    <option value="+234">🇳🇬 +234</option>
                    <option value="+254">🇰🇪 +254</option>
                    <option value="+233">🇬🇭 +233</option>
                    <option value="+27">🇿🇦 +27</option>
                    <option value="+1">🇺🇸 +1</option>
                    {/* <!-- Add more as needed --> */}
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="812 345 6789"
                    className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                    pattern="[0-9\s]+"
                    required
                  />
                </div>
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
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                      if (confirmPassword) {
                        validateConfirmPassword(confirmPassword);
                      }
                    }}
                    className={`w-full px-3 py-2 border ${
                      errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white pr-10`}
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
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <div className="mt-2 text-xs text-gray-500">
                  <p>Your password should be strong o! Make sure e get:</p>
                  <ul className="list-disc pl-5 mt-1">
                    {PASSWORD_REQUIREMENTS.map((req, index) => (
                      <li 
                        key={index} 
                        className={req.regex.test(password) ? 'text-green-600' : 'text-gray-500'}
                      >
                        {req.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      validateConfirmPassword(e.target.value);
                    }}
                    className={`w-full px-3 py-2 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white pr-10`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  I agree to UncleReuben&apos;s {' '}
                  <Link href="/terms-of-service" className="font-medium text-primary-600 hover:text-primary-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" className="font-medium text-primary-600 hover:text-primary-500">
                    Privacy Policy {' '}
                  </Link>
                  we put you first!
                </label>
              </div>

            <input name="flow" value="signUp" type="hidden" />
            <button 
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              type="submit">
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Signing up...
                  </>
                ) : (
                  'Sign up'
                )}
            </button>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          
          </form>
    </div>
  )
}

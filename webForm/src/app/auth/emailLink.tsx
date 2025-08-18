
"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import OtpInput from "@/components/ui/otpInput";
import { useRouter } from "next/navigation";
import { useAction, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "react-toastify";
 
export default function EmailLink() {
  const { signIn } = useAuthActions();
  const addUser = useAction(api.resources.users.addUserAccount);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const router = useRouter();

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };


  return step === "signIn" ? (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;

        try {
          // First try to send the OTP
          await signIn("resend-otp", formData);
          setStep({ email });
        } catch (error: any) {
          // If user doesn't exist, create a new one with default 'user' role
          if (error.message?.includes("No user with this email")) {
            try {
              // Generate a temporary password for the user
              const tempPassword = Math.random().toString(36).slice(-10);
              
              // Create the user with default 'user' role
              await addUser({
                name: email.split('@')[0],
                email,
                password: tempPassword,
                confirmPassword: tempPassword,
                username: email.split('@')[0],
                affiliated: false,
                internalRequest: true
              });

              // Retry sending the OTP
              await signIn("resend-otp", formData);
              setStep({ email });
              toast.success("Account created successfully! Please check your email for the verification code.");
            } catch (createUserError) {
              console.error("Error creating user:", createUserError);
              toast.error("Failed to create account. Please try again.");
            }
          } else {
            console.error("Error sending OTP:", error);
            toast.error("Failed to send verification code. Please try again.");
          }
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="your@email.com"
            required
          />
        </div>
      <div className="mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
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
    </form>
  ) : (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setIsLoading(true);
        
        const formData = new FormData();
        formData.set("email", step.email);
        formData.set("code", otp);
        
        try {
          await signIn("resend-otp", formData);
          router.push("/");
        } catch (error) {
          console.error("Verification error:", error);
          toast.error("Invalid verification code. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }}
    >

      <OtpInput length={6} onChange={handleOtpChange} />

      <input name="email" value={step.email} type="hidden" />
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
          onClick={() => setStep("signIn")}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
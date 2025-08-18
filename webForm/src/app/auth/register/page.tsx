'use client';

// import { useState } from "react";
// import { Lock } from "lucide-react";
import Link from "next/link";
import SignUp from "./signup";
// import EmailLink from "../emailLink";
// import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  // const [registerType, setRegisterType] = useState('password');


  return (
    <div className="max-w-md mx-auto p-6 sm:bg-white sm:dark:bg-gray-800 rounded-lg sm:shadow-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">Join REKOBO now!</h1>
          <p className="text-center text-sm text-gray-600 italic dark:text-gray-400">Sell fast, buy fast, trade fast, with REKOBO</p>
        </div>
        {/* <Button
          variant="outline"
          className="w-full h-12 bg-primary-100 hover:bg-primary-400 text-primary-600 mb-6"
          onClick={() => setRegisterType(registerType === 'password' ? 'email' : 'password')}
        >
          <Lock className="w-5 h-5 mr-2" />
          { registerType === 'password' ? 'Sign up with email' : 'Sign up with password' }
        </Button> */}

        <SignUp />

        {/* {
          registerType === 'password' ? 
          <SignUp /> : 
          <EmailLink />
        } */}

        <p className="text-sm text-center pt-4">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary-600">Sign in</Link>
        </p>
    </div>
  )
}

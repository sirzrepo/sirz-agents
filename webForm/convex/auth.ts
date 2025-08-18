// import GitHub from "@auth/core/providers/github";
import Resend from "@auth/core/providers/resend";
import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password"
import { ResendOTP } from "./otp/ResendOTP";
import { ConvexError } from "convex/values";
import { ResendOTPPasswordReset } from "./passwordReset/ResendOTPPasswordReset";
import { DataModel } from "./_generated/dataModel";
import { z } from 'zod'

const ParamSchema = z.object({
  email: z.string().email(),
})

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Resend,
    ResendOTP,
    Password({
      id: 'password',
      verify: ResendOTP,
      reset: ResendOTPPasswordReset,
      profile(params) {
        const { error, data } = ParamSchema.safeParse(params)

        if (error) {
          throw new ConvexError(error.format())
        }

        return {
          email: data.email,
          name: params.name as string,
          username: params.username as string,
          // affiliated: params.affiliated as boolean ?? false,
        }
      },
      validatePasswordRequirements: (password: string) => {
        if (
          password.length < 8 ||
          !/\d/.test(password) ||
          !/[a-z]/.test(password) ||
          !/[A-Z]/.test(password)
        ) {
          throw new ConvexError("Invalid Password")
        }
      }
      // Email verification is enabled by default when 'verify' is provided
    }),
  ],
});

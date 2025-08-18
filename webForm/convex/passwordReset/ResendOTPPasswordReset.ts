import { Email } from "@convex-dev/auth/providers/Email";
import { alphabet, generateRandomString } from "oslo/crypto";
import { Resend as ResendAPI } from "resend";
import { generateEmail } from "../helpers/generateEmail";

export const ResendOTPPasswordReset = Email({
    id: "resend-otp-password-reset",
    apiKey: process.env.AUTH_RESEND_KEY || "e_c4FSCSoZ_5haEDwY9mcJfjNM4w1j5KDZK",
    maxAge: 10 * 60, // 10 minutes in seconds
    async generateVerificationToken() {
        return generateRandomString(6, alphabet("0-9"));
    },
    async sendVerificationRequest({
        identifier: email,
        provider,
        token,
        expires,
    }) {
        const resend = new ResendAPI(provider.apiKey);
        const emailData = generateEmail({
            email,
            token,
            expires: expires.getTime(),
            subject: `Reset password in Rekobo`,
            message: `You requested to reset your password for your Rekobo account. Please use the code below to complete the process.`,
            cta: "Your reset code",
            disclaimer: "If you didn't request a password reset, you can safely ignore this email.",
        });

        const { error } = await resend.emails.send(emailData);

        if (error) {
            throw new Error(JSON.stringify(error));
        }
    },
});
import { Email } from "@convex-dev/auth/providers/Email";
import { alphabet, generateRandomString } from "oslo/crypto";
import { Resend as ResendAPI } from "resend";
import { generateEmail as createVerificationEmail } from "../helpers/generateEmail";
// import { VerificationCodeEmail } from "./VerificationCodeEmail";

export const ResendOTP = Email({
    id: "resend-otp",
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
        const emailData = createVerificationEmail({
            email,
            subject: `Sign in to Rekobo`,
            token,
            expires: expires.getTime(),
            message: "Enter the verification code below to continue signing in to your Rekobo account.",
            disclaimer: "If you didn't request a sign in, you can safely ignore this email.",
        });

        const { error } = await resend.emails.send(emailData);

        if (error) {
            throw new Error(JSON.stringify(error));
        }
    },
});
# Resend API Key Setup Instructions

To fix the email verification error, you need to add the Resend API key to your `.env.local` file.

## Steps:

1. Sign up for a Resend account at https://resend.com if you don't have one already
2. Get your API key from the Resend dashboard
3. Add the following line to your `.env.local` file:

```
AUTH_RESEND_KEY=re_YOUR_RESEND_API_KEY_HERE
```

Replace `re_YOUR_RESEND_API_KEY_HERE` with your actual Resend API key.

## Alternative Solution

If you want to bypass email verification temporarily for testing purposes, you can modify the login flow to skip the verification check. However, this is not recommended for production.

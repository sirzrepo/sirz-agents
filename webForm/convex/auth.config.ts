export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL || "http://localhost:5173",
      applicationID: "convex",
      password: {
        verifyEmail: true // Enables email verification and reset flow
      }
    },
  ],
};

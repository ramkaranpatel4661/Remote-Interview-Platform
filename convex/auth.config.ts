export default {
  providers: [
    {
      domain: process.env.CLERK_DOMAIN || "https://thankful-porpoise-79.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
  // Add token validation options to handle timing issues
  tokenValidation: {
    // Allow a small time tolerance for clock skew (5 minutes)
    clockTolerance: 300,
    // Enable token refresh
    enableTokenRefresh: true,
  },
};
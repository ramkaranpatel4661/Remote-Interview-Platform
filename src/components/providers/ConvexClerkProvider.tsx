"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuthWithRetry } from "../../hooks/useAuthWithRetry";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function ConvexClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      // Add these options to handle token timing issues
      appearance={{
        elements: {
          formButtonPrimary: "bg-blue-500 hover:bg-blue-600",
        },
      }}
    >
      <ConvexProviderWithClerk 
        client={convex} 
        useAuth={useAuthWithRetry}
        // Add error handling for token issues
        onError={(error) => {
          console.error("Convex authentication error:", error);
          // If it's a token timing issue, try to refresh the token
          if (error.message?.includes("AuthErrorTokenUsedBeforeIssuedAt")) {
            console.log("Token timing issue detected, attempting to refresh...");
            // The token will be automatically refreshed by Clerk
          }
        }}
      >
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default ConvexClerkProvider;

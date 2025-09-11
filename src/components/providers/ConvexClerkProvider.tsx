"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuthWithRetry } from "../../hooks/useAuthWithRetry";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Convex URL not configured");
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

function ConvexClerkProvider({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  console.log("Environment check:");
  console.log("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:", publishableKey ? "Set" : "Missing");
  console.log("NEXT_PUBLIC_CONVEX_URL:", process.env.NEXT_PUBLIC_CONVEX_URL ? "Set" : "Missing");
  console.log("NEXT_PUBLIC_CLERK_PROXY_URL:", process.env.NEXT_PUBLIC_CLERK_PROXY_URL ? "Set" : "Missing");
  
  // Check if we're in development
  console.log("NODE_ENV:", process.env.NODE_ENV);
  
  if (!publishableKey) {
    console.error("❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing!");
    console.error("Please add it to your .env.local file");
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Configuration Error</h2>
        <p className="text-gray-600 mb-4">
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing from your environment variables.
        </p>
        <p className="text-sm text-gray-500">
          Check the console for more details and configure your .env.local file.
        </p>
      </div>
    );
  }

  return (
    <ClerkProvider 
      publishableKey={publishableKey}
      appearance={{
        elements: {
          formButtonPrimary: "bg-blue-500 hover:bg-blue-600",
        },
      }}
    >
      <ConvexProviderWithClerk 
        client={convex} 
        useAuth={useAuthWithRetry}
      >
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default ConvexClerkProvider;

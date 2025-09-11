"use client";

import { useUser, SignIn, SignUp } from "@clerk/nextjs";
import { useState } from "react";

export default function DebugClerkPage() {
  const { user, isLoaded } = useUser();
  const [debugInfo, setDebugInfo] = useState<any>({});

  const checkClerkConfig = () => {
    const info = {
      isLoaded,
      user: user ? {
        id: user.id,
        emailAddresses: user.emailAddresses,
        emailAddress: user.primaryEmailAddress?.emailAddress,
        verified: user.primaryEmailAddress?.verification?.status,
      } : null,
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20) + "...",
      domain: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('pk_test') ? 'Development' : 'Production',
    };
    setDebugInfo(info);
    console.log("Clerk Debug Info:", info);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Clerk Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Debug Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Debug Information</h2>
          <button 
            onClick={checkClerkConfig}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Check Clerk Configuration
          </button>
          
          {Object.keys(debugInfo).length > 0 && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Sign Up Form */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Sign Up</h2>
          <div className="p-4 border rounded-lg">
            <SignUp 
              appearance={{
                elements: {
                  formButtonPrimary: "bg-blue-500 hover:bg-blue-600",
                  card: "shadow-lg",
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Troubleshooting Tips */}
      <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting OTP Issues</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Clerk Dashboard Settings:</h3>
            <ul className="space-y-1">
              <li>• Go to Clerk Dashboard → Settings → Email & SMS</li>
              <li>• Enable "Email verification"</li>
              <li>• Check email template configuration</li>
              <li>• Verify sender email address</li>
              <li>• Check rate limits and quotas</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Common Issues:</h3>
            <ul className="space-y-1">
              <li>• Check spam/junk folder</li>
              <li>• Verify email address is correct</li>
              <li>• Check if email provider blocks automated emails</li>
              <li>• Verify domain is added to Clerk</li>
              <li>• Check Clerk dashboard for error logs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Environment Check */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Environment Variables:</h3>
        <div className="text-sm space-y-1">
          <p>Publishable Key: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing"}</p>
          <p>Environment: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes('pk_test') ? "Development" : "Production"}</p>
        </div>
      </div>
    </div>
  );
}

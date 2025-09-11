"use client";

import { useEffect, useState } from "react";

export default function EnvCheckPage() {
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    setEnvVars({
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
      NEXT_PUBLIC_CLERK_PROXY_URL: process.env.NEXT_PUBLIC_CLERK_PROXY_URL,
      NODE_ENV: process.env.NODE_ENV,
    });
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Check</h1>
      <div className="space-y-4">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex items-center gap-4 p-4 border rounded-lg">
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {key}
            </span>
            <span className={`text-sm ${value ? "text-green-600" : "text-red-600"}`}>
              {value ? "✅ Set" : "❌ Missing"}
            </span>
            {value && key.includes("PUBLISHABLE_KEY") && (
              <span className="text-xs text-gray-500">
                {value.substring(0, 20)}...
              </span>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold mb-2">Required Environment Variables:</h2>
        <ul className="text-sm space-y-1">
          <li>• NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY - Your Clerk publishable key</li>
          <li>• NEXT_PUBLIC_CONVEX_URL - Your Convex deployment URL</li>
          <li>• CLERK_SECRET_KEY - Your Clerk secret key (for server-side)</li>
          <li>• NEXT_PUBLIC_STREAM_API_KEY - Your Stream API key</li>
          <li>• STREAM_SECRET_KEY - Your Stream secret key</li>
        </ul>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h2 className="font-semibold mb-2">Troubleshooting OTP Issues:</h2>
        <ul className="text-sm space-y-1">
          <li>• Make sure your Clerk application is configured for email verification</li>
          <li>• Check your Clerk dashboard for email template configuration</li>
          <li>• Verify your domain is added to Clerk's allowed origins</li>
          <li>• Check your email provider's spam folder</li>
          <li>• Ensure webhook endpoints are properly configured in Clerk</li>
        </ul>
      </div>
    </div>
  );
}

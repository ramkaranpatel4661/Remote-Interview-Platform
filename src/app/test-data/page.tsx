"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function TestDataPage() {
  const users = useQuery(api.users.getUsers);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Test Data Page</h1>
      
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Users Query Result</h2>
        
        {users === undefined ? (
          <p className="text-yellow-600">Loading users...</p>
        ) : users === null ? (
          <p className="text-red-600">Error loading users (null result)</p>
        ) : (
          <div>
            <p className="text-green-600 mb-4">✅ Users loaded successfully! Count: {users.length}</p>
            
            {users.length === 0 ? (
              <p className="text-orange-600">No users found in database</p>
            ) : (
              <div className="space-y-2">
                <h3 className="font-medium">Users in database:</h3>
                {users.map((user, index) => (
                  <div key={user.clerkId} className="p-2 border rounded bg-gray-50">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Clerk ID:</strong> {user.clerkId}</p>
                  </div>
                ))}
                
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <h3 className="font-medium mb-2">Filtered Results:</h3>
                  <p>Candidates: {users.filter(u => u.role === "candidate").length}</p>
                  <p>Interviewers: {users.filter(u => u.role === "interviewer").length}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function DebugUsersPage() {
  const { user } = useUser();
  const users = useQuery(api.users.getUsers);
  const currentUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id || "",
  });
  const syncUser = useMutation(api.users.syncUser);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    if (!user?.id || !user?.primaryEmailAddress?.emailAddress) return;
    
    setIsSyncing(true);
    try {
      const userName = user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.primaryEmailAddress.emailAddress;
      
      await syncUser({
        name: userName,
        email: user.primaryEmailAddress.emailAddress,
        clerkId: user.id,
        image: user.imageUrl || undefined
      });
      
      alert("User synced successfully!");
    } catch (error) {
      console.error("Sync error:", error);
      alert("Failed to sync user. Check console for details.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Users Debug Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Clerk User */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Current Clerk User</h2>
          {user ? (
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Image:</strong> {user.imageUrl}</p>
            </div>
          ) : (
            <p>No user signed in</p>
          )}
        </div>

        {/* Current User in Database */}
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Current User in Database</h2>
          {currentUser ? (
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {currentUser.clerkId}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Name:</strong> {currentUser.name}</p>
              <p><strong>Role:</strong> {currentUser.role}</p>
              <p><strong>Image:</strong> {currentUser.image}</p>
            </div>
          ) : (
            <div>
              <p className="mb-2">User not found in database</p>
              <button 
                onClick={handleManualSync}
                disabled={isSyncing || !user}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isSyncing ? "Syncing..." : "Sync User to Database"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* All Users in Database */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">All Users in Database ({users?.length || 0})</h2>
        {users && users.length > 0 ? (
          <div className="space-y-4">
            {users.map((dbUser) => (
              <div key={dbUser.clerkId} className="p-4 border rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p><strong>Name:</strong> {dbUser.name}</p>
                    <p><strong>Email:</strong> {dbUser.email}</p>
                  </div>
                  <div>
                    <p><strong>Clerk ID:</strong> {dbUser.clerkId}</p>
                    <p><strong>Role:</strong> {dbUser.role}</p>
                  </div>
                  <div>
                    <p><strong>Image:</strong> {dbUser.image ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p><strong>Is Current User:</strong> {dbUser.clerkId === user?.id ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 border border-dashed rounded-lg text-center text-muted-foreground">
            No users found in database. Users need to sign up and be synced via webhook.
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Troubleshooting Steps:</h3>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>If no users appear, the webhook might not be working</li>
          <li>Check your Clerk dashboard webhook configuration</li>
          <li>Verify the webhook URL points to your Convex deployment</li>
          <li>Make sure webhook events (user.created, user.updated) are enabled</li>
          <li>Check the Convex logs for webhook errors</li>
        </ol>
      </div>
    </div>
  );
}

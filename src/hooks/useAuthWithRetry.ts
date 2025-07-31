import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function useAuthWithRetry() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const getTokenWithRetry = async (options?: { template?: string }) => {
    try {
      return await getToken(options);
    } catch (error: any) {
      console.error("Token retrieval error:", error);
      
      // If it's a timing issue and we haven't retried too many times
      if (
        error.message?.includes("AuthErrorTokenUsedBeforeIssuedAt") &&
        retryCount < 3
      ) {
        setIsRetrying(true);
        setRetryCount(prev => prev + 1);
        
        // Wait a bit before retrying (exponential backoff)
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, retryCount) * 1000)
        );
        
        console.log(`Retrying token retrieval (attempt ${retryCount + 1})`);
        return await getTokenWithRetry(options);
      }
      
      throw error;
    } finally {
      setIsRetrying(false);
    }
  };

  // Reset retry count when auth state changes
  useEffect(() => {
    setRetryCount(0);
  }, [isSignedIn]);

  return {
    isLoaded,
    isSignedIn,
    getToken: getTokenWithRetry,
    isRetrying,
    retryCount,
  };
} 
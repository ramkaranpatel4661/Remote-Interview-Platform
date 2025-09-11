"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

export const streamTokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User not authenticated");

  if (!process.env.NEXT_PUBLIC_STREAM_API_KEY || !process.env.STREAM_SECRET_KEY) {
    throw new Error("Stream API keys not configured");
  }

  const streamClient = new StreamClient(
    process.env.NEXT_PUBLIC_STREAM_API_KEY,
    process.env.STREAM_SECRET_KEY
  );

  // Backdate iat slightly to tolerate local clock skew and CF edge timing
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const token = streamClient.generateUserToken({
    user_id: user.id,
    iat: nowInSeconds - 60,
  });

  return token;
};

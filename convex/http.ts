import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    console.log("Webhook received:", request.method, request.url);
    
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("No svix headers found", {
        status: 400,
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }

    const eventType = evt.type;
    console.log("Webhook event received:", eventType);

    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      if (!email_addresses || email_addresses.length === 0) {
        console.log("No email addresses found for user:", id);
        return new Response("No email addresses found", { status: 400 });
      }

      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim() || email;

      console.log("Processing user webhook:", { id, email, name, eventType });

      try {
        await ctx.runMutation(api.users.syncUser, {
          clerkId: id,
          email,
          name,
          image: image_url,
        });
        console.log("User synced successfully:", { id, email });
      } catch (error) {
        console.error("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    } else {
      console.log("Unhandled webhook event type:", eventType);
    }

    return new Response("Webhook processed successfully", { status: 200 });
  }),
});

// Test endpoint to verify webhook is working
http.route({
  path: "/test-webhook",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    console.log("Test webhook endpoint hit");
    return new Response("Webhook endpoint is working", { status: 200 });
  }),
});

export default http;

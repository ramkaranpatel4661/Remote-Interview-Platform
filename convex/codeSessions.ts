import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByInterviewId = query({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, { interviewId }) => {
    const session = await ctx.db
      .query("codeSessions")
      .withIndex("by_interviewId", (q) => q.eq("interviewId", interviewId))
      .unique();
    return session;
  },
});

export const updateCode = mutation({
  args: { id: v.id("codeSessions"), code: v.string() },
  handler: async (ctx, { id, code }) => {
    await ctx.db.patch(id, { code });
  },
});

export const updateLanguage = mutation({
  args: { id: v.id("codeSessions"), language: v.union(v.literal("javascript"), v.literal("python"), v.literal("java")), code: v.string() },
  handler: async (ctx, { id, language, code }) => {
    await ctx.db.patch(id, { language, code });
  },
});

export const updateQuestion = mutation({
  args: { id: v.id("codeSessions"), questionId: v.string(), starterCode: v.string() },
  handler: async (ctx, { id, questionId, starterCode }) => {
    await ctx.db.patch(id, { questionId, code: starterCode });
  },
});
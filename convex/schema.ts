import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
    role: v.union(v.literal("candidate"), v.literal("interviewer")),
  }).index("by_clerk_id", ["clerkId"]),

  interviews: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    status: v.string(), // "upcoming", "live", "completed"
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
  })
    .index("by_stream_call_id", ["streamCallId"])
    .index("by_candidate_id", ["candidateId"]),

  comments: defineTable({
    interviewId: v.id("interviews"),
    interviewerId: v.string(),
    content: v.string(),
    rating: v.number(),
  }).index("by_interview_id", ["interviewId"]),

  codeSessions: defineTable({
    interviewId: v.id("interviews"),
    code: v.string(),
    language: v.union(v.literal("javascript"), v.literal("python"), v.literal("java")),
    questionId: v.string(),
  }).index("by_interviewId", ["interviewId"]),
});
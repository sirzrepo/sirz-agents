import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    recipientId: v.id("users"), // Added for easier querying
    content: v.string(),
    sentAt: v.number(), // Changed to number for easier sorting
    read: v.boolean(),
    readAt: v.optional(v.number()),
    type: v.union(
      v.literal("text"),
      v.literal("image"),
      v.literal("document"),
      v.literal("offer")
    ),
    metadata: v.optional(v.any()), // For additional data like file URLs, offer details, etc.
    deletedFor: v.optional(v.array(v.id("users"))), // Track which users have deleted this message
  })
  .index("by_conversation", ["conversationId"])
  .index("by_sender", ["senderId"])
  .index("by_recipient", ["recipientId"])
  .index("by_conversation_and_time", ["conversationId", "sentAt"]);
import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    messageId: v.id("message"),
    userId: v.id("users"),
    readAt: v.number(),
  }).index("by_message_user", ["messageId", "userId"]);
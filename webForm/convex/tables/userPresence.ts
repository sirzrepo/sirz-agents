import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    userId: v.id("users"),
    status: v.union(
      v.literal("online"),
      v.literal("offline"),
      v.literal("away")
    ),
    lastSeen: v.number(),
  }).index("by_user", ["userId"]);
  
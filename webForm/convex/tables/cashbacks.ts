import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    userId: v.id("users"),
    totalEarned: v.optional(v.number()),
    totalUsed: v.optional(v.number()),
    available: v.optional(v.number()),
})
.index("by_user", ["userId"])
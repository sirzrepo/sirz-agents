import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    path: v.string(),
    method: v.string(),
    timestamp: v.number(),
    userId: v.optional(v.id('users')),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
})
    .index('by_user_id', ['userId'])
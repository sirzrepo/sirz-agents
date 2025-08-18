import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    userId: v.id("users"),
    code: v.optional(v.string()),
    value: v.optional(v.number()),
    usedAt: v.optional(v.number()),
})
.index("by_user", ["userId"])
.index("by_code", ["code"])
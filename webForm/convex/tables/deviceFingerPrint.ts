
import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    userId: v.id("users"),
    fingerprint: v.string(),
})
.index("by_user", ["userId"])
.index("by_fingerprint", ["fingerprint"])
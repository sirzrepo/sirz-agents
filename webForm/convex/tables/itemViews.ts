import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    userId: v.id("users"),
    listingId: v.id("listing"),
    views: v.optional(v.number()),
    isUniqueCounted: v.optional(v.boolean()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
})
.index("by_user", ["userId"])
.index("by_listing", ["listingId"])
.index("by_user_listing", ["userId", "listingId"])


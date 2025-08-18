import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
})
.index("by_user", ["userId"])
.index("by_product", ["productId"])
.index("by_user_product", ["userId", "productId"])
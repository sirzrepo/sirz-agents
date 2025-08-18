import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    productId: v.optional(v.id("products")),
    userId: v.id('users'),
})
    .index('by_product', ['productId'])
    .index('by_user', ['userId'])
    .index('by_user_and_product', ['userId', 'productId']);
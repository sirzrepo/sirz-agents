import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    productId: v.id('products'),
    userId: v.id('users'),
    comment: v.string(),
    rating: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
})
    .index('by_product_id', ['productId'])
    .index('by_user_id', ['userId'])
    .index('by_rating', ['rating'])
    .index('by_user_product', ['userId', 'productId']);
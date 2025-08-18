import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    userId: v.id("users"),
    orderId: v.id("orders"),
    amount: v.number(),
    percentage: v.number(),
    transactionType: v.string(), // "earn" or "use"
    createdAt: v.number(),
})
.index("by_user", ["userId"])
.index("by_order", ["orderId"])

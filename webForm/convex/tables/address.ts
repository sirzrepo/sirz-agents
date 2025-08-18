import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    userId: v.id("users"), // foreign key to the user
    street: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    country: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    isDefault: v.optional(v.boolean()),
})
.index('state', ['state'])
.index("city", ["city"])
.index("country", ["country"])
.index("by_user_id", ["userId"])
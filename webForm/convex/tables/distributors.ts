import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    businessName: v.string(),
    createdBy: v.id('users'),
    address: v.string(),
    region: v.string(),
    city: v.string(),
    state: v.string(),
    country: v.optional(v.string()),
    contact: v.optional(v.string()),
    email: v.optional(v.string()),
}).index("by_email", ["email"])
    .index("by_businessName", ["businessName"])
    .index("by_country", ["country"])
    .index("by_state", ["state"])
    .index("by_region", ["region"])
// 
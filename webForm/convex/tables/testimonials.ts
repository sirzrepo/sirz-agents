import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    name: v.string(),
    testimony: v.string(),
    status: v.string(), // accepted, pending, rejected
    reviewDate: v.optional(v.number()),
    testifierImage: v.optional(v.id('_storage'))
})
    .index('by_name', ['name'])
    .index('by_status', ['status'])
import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    name: v.string(),
    description: v.string(),
    active: v.boolean(),
    updatedAt: v.number(),
})
    .index('by_name', ['name'])
    .index('by_active', ['active'])

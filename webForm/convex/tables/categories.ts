import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    name: v.string(),
    updatedAt: v.number(),
})
    .index('by_name', ['name'])
    .index('by_updated_at', ['updatedAt'])

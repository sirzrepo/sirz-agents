import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    question: v.string(),
    answer: v.string(),
    status: v.string(), // published, draft
    category: v.string(), // billing, KDM
    displayOrder: v.number(),
})
    .index('by_status', ['status'])
    .index('by_category', ['category'])
    .index('by_display_order', ['displayOrder'])
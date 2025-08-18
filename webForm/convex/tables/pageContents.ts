import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    label: v.string(),
    content: v.string()
})
    .index('by_label', ['label'])
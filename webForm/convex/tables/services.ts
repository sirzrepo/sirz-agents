import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    name: v.string(),
    description: v.string(),
    price: v.string()
})
    .index('by_name', ['name'])
import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    title: v.string(),
    content: v.string(),
    summary: v.string(),
    author: v.id("users"),
    category: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
    publishedAt: v.optional(v.number()),
    featuredImage: v.optional(v.id('_storage')),
    tags: v.optional(v.string()),
    slug: v.string(),
    metaDescription: v.optional(v.string()),
    views: v.number(),
    readingTime: v.optional(v.number()),
}).index("by_status", ["status"])
    .index("by_author", ["author"])
    .index("by_slug", ["slug"])
    .index("by_category", ["category"]);
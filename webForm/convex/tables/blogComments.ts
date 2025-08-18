import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    blogId: v.id('blogs'),
    authorName: v.string(),
    content: v.string(),
})
    .index('by_blog_id', ['blogId'])
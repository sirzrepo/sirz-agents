import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    name: v.string(),
    email: v.string(),
    portfolioUrl: v.string(),
    programmingLanguages: v.string(),
    areasOfInterest: v.string(),
    experience: v.string(),
    projectIdea: v.optional(v.string())
})
    .index('by_name', ['name'])
    .index('by_email', ['email'])
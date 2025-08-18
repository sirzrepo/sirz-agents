import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    title: v.string(),
    description: v.string(),
    status: v.string(), // open, closed, draft
    openings: v.number(),
    deadline: v.optional(v.number()),
    department: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    employmentType: v.optional(v.string()), // remote, full-time, part-time, contract
    salaryFrom: v.optional(v.number()),
    salaryTo: v.optional(v.number()),
    salaryCurrency: v.optional(v.string()),
    salaryPeriod: v.optional(v.string()),
})
    .index('by_title', ['title'])
    .index('by_status', ['status'])
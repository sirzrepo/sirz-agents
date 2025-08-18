import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    jobId: v.id('jobs'),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    resume: v.optional(v.id('_storage')),
    status: v.string(), // review, flagged, interview, hired, rejected
})
    .index('by_job_id', ['jobId'])
    .index('by_email', ['email'])
    .index('by_status', ['status'])
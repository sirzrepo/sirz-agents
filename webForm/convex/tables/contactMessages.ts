import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    subject: v.string(),
    message: v.string()
})
    .index('by_name', ['name'])
    .index('by_email', ['email'])
    .index('by_phone', ['phone'])
    .index('by_subject', ['subject'])
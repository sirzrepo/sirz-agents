import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    email: v.optional(v.string()), // email of the subscriber
}).index("by_email", ["email"])
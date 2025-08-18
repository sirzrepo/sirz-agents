import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    eventId: v.id('events'),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    checkedIn: v.boolean(),
})
    .index('by_event_id', ['eventId'])
    .index('by_name', ['name'])
    .index('by_email', ['email'])
    .index('by_phone', ['phone'])
    .index('by_checked_in', ['checkedIn'])
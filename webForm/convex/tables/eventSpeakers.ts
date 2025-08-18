import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    eventId: v.id('events'),
    name: v.string(),
    description: v.optional(v.string()),
    thumbnail: v.optional(v.id('_storage')),
})
    .index('by_event_id', ['eventId'])
    .index('by_name', ['name'])
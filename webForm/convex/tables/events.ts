import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    title: v.string(),
    description: v.string(),
    dateTime: v.number(),
    venue: v.string(),
    venueType: v.string(),
    eventType: v.string(),
    thumbnail: v.optional(v.id('_storage')),
    createdBy: v.id('users'),
})
    .index('by_title', ['title'])
    .index('by_date_time', ['dateTime'])
    .index('by_venue', ['venue'])
    .index('by_venue_type', ['venueType'])
    .index('by_event_type', ['eventType'])
    .index('by_created_by', ['createdBy']);
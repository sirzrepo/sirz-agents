import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    fileName: v.optional(v.string()),
    fileType: v.optional(v.string()), // mime type
    fileSize: v.optional(v.number()),
    category: v.optional(v.string()),
    storageId: v.optional(v.id('_storage')), // reference to actual file in storage
    mediaType: v.union(v.literal('image'), v.literal('audio'), v.literal('video'), v.literal('youtube')),
    uploadedBy: v.id('users'),
    metadata: v.optional(v.object({
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        duration: v.optional(v.number()),
        description: v.optional(v.string())
    })),
    youtubeUrl: v.optional(v.string())
})
    .index('by_user', ['uploadedBy'])
    .index('by_type', ['mediaType'])
    .index("by_category", ["category"]);

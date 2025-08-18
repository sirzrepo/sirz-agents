import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
  // User who will receive the notification
  userId: v.id("users"),
  
  // Notification metadata
  type: v.union(
    v.literal("booking"),
    v.literal("message"),
    v.literal("payment"),
    v.literal("system"),
    v.literal("activity"),
    v.literal("warning"),
    v.literal("listing"),
  ),
  title: v.string(),
  message: v.string(),
  
  // Notification status
  read: v.boolean(),
  starred: v.boolean(),
  priority: v.union(
    v.literal("high"),
    v.literal("medium"),
    v.literal("low")
  ),
  category: v.union(
    v.literal("booking"),
    v.literal("messages"),
    v.literal("payments"),
    v.literal("account"),
    v.literal("activity"),
    v.literal("listings")
  ),
  
  // Sender information
  senderId: v.optional(v.union(v.id("users"), v.literal("system"))),
  senderName: v.optional(v.string()),
  avatar: v.optional(v.string()),
  
  // Notification details (can be any JSON structure)
  details: v.optional(v.any()),
  
  // Action buttons
  actions: v.optional(
    v.array(
      v.object({
        label: v.string(),
        type: v.union(v.literal("primary"), v.literal("secondary")),
        href: v.string()
      })
    )
  ),
  
  // Timestamps
  createdAt: v.number(),
  updatedAt: v.optional(v.number()),
  
  // For soft deletes
  deletedAt: v.optional(v.number()),
})
  .index('by_user', ['userId'])
  .index('by_read', ['read'])
  .index('by_category', ['category'])
  .index('by_priority', ['priority'])
  .index('by_created', ['createdAt']);
import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
  listingId: v.id("listing"),
  buyerId: v.id("users"),
  sellerId: v.id("users"),
  lastMessageAt: v.number(), // Changed to number for easier sorting
  lastMessage: v.optional(v.string()), // Preview of last message
  lastMessageBy: v.optional(v.id("users")), // Who sent the last message
  unreadCount: v.optional(v.number()), // Count of unread messages
  deletedFor: v.optional(v.array(v.id("users"))),
  status: v.union(
    v.literal("active"),
    v.literal("archived"),
    v.literal("deleted"),
    v.literal("sent"),
    v.literal("delivered"),
    v.literal("read"),
    v.literal("failed")
  ),
  createdAt: v.number(),
  updatedAt: v.number(),
})
.index("by_buyer_listing", ["buyerId"])
.index("by_seller_listing", ["sellerId"])
.index("by_listing", ["listingId"])
.index("by_buyer_seller_listing", ["buyerId", "sellerId", "listingId"]);
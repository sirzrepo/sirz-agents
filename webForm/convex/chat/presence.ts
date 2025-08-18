import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// Update user's online status
export const updatePresence = mutation({
  args: {
    userId: v.id("users"),
    status: v.union(
      v.literal("online"),
      v.literal("offline"),
      v.literal("away")
    ),
  },
  handler: async (ctx, args) => {
    const { userId, status } = args;
    const now = Date.now();

    // Check if presence record exists
    const existing = await ctx.db
      .query("userPresence")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status,
        lastSeen: now,
      });
      return { ...existing, status, lastSeen: now };
    } else {
      const presenceId = await ctx.db.insert("userPresence", {
        userId,
        status,
        lastSeen: now,
      });
      return await ctx.db.get(presenceId);
    }
  },
});

// Get user's presence status
export const getUserPresence = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userPresence")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Get multiple users' presence status
export const getUsersPresence = query({
  args: { userIds: v.array(v.id("users")) },
  handler: async (ctx, args) => {
    const presences = await Promise.all(
      args.userIds.map((userId) =>
        ctx.db
          .query("userPresence")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .first()
      )
    );
    return presences.filter(Boolean);
  },
});

// Mark messages as read
export const markMessagesAsRead = mutation({
  args: {
    messageIds: v.array(v.id("message")),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { messageIds, userId } = args;
    const now = Date.now();

    // Update each message
    await Promise.all(
      messageIds.map(async (messageId) => {
        const message = await ctx.db.get(messageId);
        if (message && message.recipientId === userId && !message.read) {
          await ctx.db.patch(messageId, {
            read: true,
            readAt: now,
          });
          
          // Record read receipt
          await ctx.db.insert("messageRead", {
            messageId,
            userId,
            readAt: now,
          });
        }
      })
    );

    // Update unread count in conversation if needed
    if (messageIds.length > 0) {
      const firstMessage = await ctx.db.get(messageIds[0]);
      if (firstMessage) {
        const conversation = await ctx.db
          .query("conversations")
          .withIndex("by_id", (q) => q.eq("_id", firstMessage.conversationId))
          .first();
          
        if (conversation && typeof conversation.unreadCount === 'number' && conversation.unreadCount > 0) {
          // This is a simplified approach - in a real app, you'd want to count actual unread messages
          await ctx.db.patch(conversation._id, {
            unreadCount: Math.max(0, (conversation.unreadCount || 0) - messageIds.length),
          });
        }
      }
    }

    return { success: true };
  },
});

// Get read receipts for a message
export const getMessageReadReceipts = query({
  args: { messageId: v.id("message") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messageRead")
      .withIndex("by_message_user", (q) => q.eq("messageId", args.messageId))
      .collect();
  },
});

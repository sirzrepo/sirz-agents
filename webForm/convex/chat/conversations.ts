import { Id } from "../_generated/dataModel";
import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// Start or get an existing conversation
export const getOrCreateConversation = mutation({
  args: {
    listingId: v.id("listing"),
    buyerId: v.id("users"),
    sellerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { listingId, buyerId, sellerId } = args;
    const now = Date.now();

    // Check if conversation already exists
    const existing = await ctx.db
      .query("conversations")
      .withIndex("by_buyer_seller_listing", (q) =>
        q.eq("buyerId", buyerId).eq("sellerId", sellerId).eq("listingId", listingId)
      )
      .first();

    if (existing) {
      // Reactivate if archived or deleted
      if (existing.status !== "active") {
        await ctx.db.patch(existing._id, {
          status: "active",
          updatedAt: now,
        });
        return { ...existing, status: "active", updatedAt: now };
      }
      return existing;
    }

    // Create new conversation
    const conversationId = await ctx.db.insert("conversations", {
      listingId,
      buyerId,
      sellerId,
      status: "active",
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
      unreadCount: 0,
    });

    return await ctx.db.get(conversationId);
  },
});

// Get all conversations for a user
export const getUserConversations = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const { userId } = args;
    const now = Date.now();
    
    // Get conversations where user is either buyer or seller
    const buyerConversations = await ctx.db
      .query("conversations")
      .withIndex("by_buyer_listing", (q) => q.eq("buyerId", userId))
      .collect();

    const sellerConversations = await ctx.db
      .query("conversations")
      .withIndex("by_seller_listing", (q) => q.eq("sellerId", userId))
      .collect();

    // Merge and deduplicate conversations
    const allConversations = [...buyerConversations, ...sellerConversations];
    const uniqueConversations = Array.from(
      new Map(allConversations.map((conv) => [conv._id, conv])).values()
    );

    // Sort by last message time (newest first)
    return uniqueConversations.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  },
});

// Archive a conversation
export const archiveConversation = mutation({
  args: { conversationId: v.id("conversations"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const { conversationId, userId } = args;
    const conversation = await ctx.db.get(conversationId);
    
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Verify user is part of the conversation
    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      throw new Error("Not authorized to archive this conversation");
    }

    await ctx.db.patch(conversationId, {
      status: "archived",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get count of unread conversations for the current user
export const getUnreadConversationsCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) return 0;

    // Get all conversations where the user is a participant
    const [buyerConversations, sellerConversations] = await Promise.all([
      ctx.db
        .query("conversations")
        .withIndex("by_buyer_listing", (q) => q.eq("buyerId", userId as Id<"users">))
        .collect(),
      
      ctx.db
        .query("conversations")
        .withIndex("by_seller_listing", (q) => q.eq("sellerId", userId as Id<"users">))
        .collect()
    ]);

    // Combine and deduplicate conversations
    const allConversations = [...buyerConversations, ...sellerConversations];
    const uniqueConversations = Array.from(
      new Map(allConversations.map(conv => [conv._id.toString(), conv])).values()
    );

    // Count conversations with unread messages
    return uniqueConversations.reduce((count, conv) => {
      // Check if the user is the recipient of unread messages
      const isRecipient = 
        (conv.lastMessageBy !== userId) && // Message is from the other user
        (conv.unreadCount && conv.unreadCount > 0); // Has unread messages
      
      return isRecipient ? count + 1 : count;
    }, 0);
  },
});

// Get conversation by ID
export const getConversation = query({
  args: { conversationId: v.id("conversations"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const { conversationId, userId } = args;
    const conversation = await ctx.db.get(conversationId);
    
    if (!conversation) {
      return null;
    }

    // Verify user is part of the conversation
    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      throw new Error("Not authorized to view this conversation");
    }

    return conversation;
  },
});

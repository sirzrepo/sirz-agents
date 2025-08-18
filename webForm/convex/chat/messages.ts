import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

// Send a new message
// export const sendMessage = mutation({
//   args: {
//     conversationId: v.id("conversations"),
//     senderId: v.id("users"),
//     content: v.string(),
//     type: v.union(
//       v.literal("text"),
//       v.literal("image"),
//       v.literal("document"),
//       v.literal("offer")
//     ),
//     metadata: v.optional(v.any()),
//   },
//   handler: async (ctx, args) => {
//     const { conversationId, senderId, content, type, metadata } = args;
//     const now = Date.now();

//     // Get conversation to verify participants
//     const conversation = await ctx.db.get(conversationId);
//     if (!conversation) {
//       throw new Error("Conversation not found");
//     }

//     // Determine recipient
//     const recipientId = 
//       conversation.buyerId === senderId 
//         ? conversation.sellerId 
//         : conversation.buyerId;

//     // Create the message
//     const messageId = await ctx.db.insert("message", {
//       conversationId,
//       senderId,
//       recipientId,
//       content,
//       type,
//       metadata,
//       sentAt: now,
//       read: false,
//     });

//     // Update conversation's last message info
//     await ctx.db.patch(conversationId, {
//       lastMessage: content.length > 50 ? content.substring(0, 50) + '...' : content,
//       lastMessageBy: senderId,
//       lastMessageAt: now,
//       updatedAt: now,
//       unreadCount: (conversation.unreadCount || 0) + 1,
//     });

//     return await ctx.db.get(messageId);
//   },
// });

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    type: v.union(
      v.literal("text"),
      v.literal("image"),
      v.literal("document"),
      v.literal("offer")
    ),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { conversationId, senderId, content, type, metadata } = args;
    const now = Date.now();

    // Check for disallowed patterns before processing the message
    const unsafePatterns = [
      // URLs (http, https, www)
      /(https?:\/\/[^\s]+)|(www\.[^\s]+)|\b[a-zA-Z0-9.-]+\.(com|org|net|io|me|info|xyz|biz|app|co|edu|gov|ng)\b/gi,
      // Phone numbers (international and local formats)
      /(\+?\d[\d\s\-\(\)]{7,})|(0[0-9\s\-\(\)]{4,})/gi,
      /\d{4,}/g,
      // Email addresses
      /\b[a-zA-Z0-9._%+-]+[\s\(\[]?(at|@)[\s\)\]]?[a-zA-Z0-9.-]+[\s\(\[]?(dot|\.)[\s\)\]]?[a-z]{2,}\b/gi,
      // Common social media handles (@username)
      /(?:^|\s)@[a-zA-Z0-9_]+/gi,
      // Common messaging platforms (telegram, whatsapp, signal, etc.)
      /\b(telegram|whatsapp|signal|viber|wechat|line|kik|skype|discord)[:\s\/]+[a-zA-Z0-9_\-@.]+/gi,
      // Common domain extensions that might indicate contact info
      /\b(com|org|net|io|me|info|xyz|info|biz)[^\s]*\.[a-z]{2,}\b/gi
    ];

    const normalizedContent = content.toLowerCase().replace(/\s+/g, '');

    // Check if content contains any unsafe patterns
    const hasUnsafeContent = unsafePatterns.some(pattern => 
      pattern.test(normalizedContent)
    );

    if (hasUnsafeContent) {
      // Create a more specific error message
      const errorMessage = "For your safety, messages cannot contain:\n" +
        "• Links or website addresses\n" +
        "• Phone numbers\n" +
        "• Email addresses\n" +
        "• Social media handles or usernames\n\n" +
        "Please keep all communication within Rekobo.";
      
      throw new Error(errorMessage);
    }

    // Get conversation to verify participants
    const conversation = await ctx.db.get(conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    // Determine recipient
    const recipientId = 
      conversation.buyerId === senderId 
        ? conversation.sellerId 
        : conversation.buyerId;

    // Create the message
    const messageId = await ctx.db.insert("message", {
      conversationId,
      senderId,
      recipientId,
      content,
      type,
      metadata,
      sentAt: now,
      read: false,
    });

    // Update conversation's last message info
    await ctx.db.patch(conversationId, {
      lastMessage: content.length > 50 ? content.substring(0, 47) + '...' : content,
      lastMessageBy: senderId,
      lastMessageAt: now,
      updatedAt: now,
      unreadCount: (conversation.unreadCount || 0) + 1,
    });

    return await ctx.db.get(messageId);
  },
});

// Get messages for a conversation
export const getMessages = query({
  returns: v.object({
    messages: v.array(v.any()),
    hasMore: v.boolean(),
    unreadMessageIds: v.optional(v.array(v.id('message'))),
    conversationId: v.optional(v.id('conversations'))
  }),
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    limit: v.optional(v.number()),
    cursor: v.optional(v.id("message")),
  },
  handler: async (ctx, args) => {
    const { conversationId, userId, limit = 50, cursor } = args;
    
    // Verify user has access to this conversation
    const conversation = await ctx.db.get(conversationId);
    if (!conversation || 
        (conversation.buyerId !== userId && conversation.sellerId !== userId)) {
      throw new Error("Not authorized to view these messages");
    }

    // Get messages with pagination
    let query = ctx.db
      .query("message")
      .withIndex("by_conversation_and_time", (q) =>
        q.eq("conversationId", conversationId)
      )
      .order("desc");

      let messages;
      if (cursor) {
        const result = await query.paginate({ cursor, numItems: limit });
        messages = result.page;
      } else {
        messages = await query.take(limit); // Removed .collect()
      }

    // const messages = await query;

    // Mark messages as read in a separate mutation to handle the write operation
    const unreadMessages = messages.filter(
      (msg) => msg.senderId !== userId && !msg.read
    );

    if (unreadMessages.length > 0) {
      // Instead of updating here, we'll return the unread message IDs
      // and let the client call markMessagesAsRead mutation
      return {
        messages,
        hasMore: false,
        unreadMessageIds: unreadMessages.map(msg => msg._id),
        conversationId: args.conversationId
      };
    }

    return { messages, hasMore: false };
  },
});

// Mark messages as read
export const markMessagesAsRead = mutation({
  args: {
    messageIds: v.array(v.id('message')),
    conversationId: v.id('conversations')
  } as const,
  handler: async (ctx, args) => {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) throw new Error('Not authenticated');

    // Update all messages to mark them as read
    await Promise.all(
      args.messageIds.map(messageId =>
        ctx.db.patch(messageId, {
          read: true,
          readAt: Date.now()
        })
      )
    );

    // Get the conversation to update unread count
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error('Conversation not found');

    // Calculate new unread count (can't go below 0)
    const newUnreadCount = Math.max(
      0,
      (conversation.unreadCount || 0) - args.messageIds.length
    );

    // Update conversation with new unread count
    await ctx.db.patch(args.conversationId, {
      unreadCount: newUnreadCount
    });

    return { success: true };
  }
});

// Delete a message (soft delete)
export const deleteMessage = mutation({
  args: {
    messageId: v.id("message"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { messageId, userId } = args;
    const message = await ctx.db.get(messageId);
    
    if (!message) {
      throw new Error("Message not found");
    }

    if (message.senderId !== userId) {
      throw new Error("Not authorized to delete this message");
    }

    // Soft delete by adding to deletedFor array
    await ctx.db.patch(messageId, {
      deletedFor: [...(message.deletedFor || []), userId],
    });

    return { success: true };
  },
});

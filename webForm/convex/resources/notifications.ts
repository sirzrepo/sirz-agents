import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { getAuthenticatedUser, getAuthenticationErrorMessage, getAuthorizationErrorMessage, getNotFoundErrorMessage } from "../helpers";
import { filter } from "convex-helpers/server/filter";
import { paginationOptsValidator } from "convex/server";

export const create = mutation({
  args: {
    userId: v.id("users"),
    type: v.union(
      v.literal("booking"),
      v.literal("message"),
      v.literal("payment"),
      v.literal("system"),
      v.literal("warning"),
      v.literal("activity"),
      v.literal("listing"),
    ),
    title: v.string(),
    message: v.string(),
    read: v.optional(v.boolean()),
    starred: v.optional(v.boolean()),
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
    senderId: v.optional(v.union(v.id("users"), v.literal("system"))),
    senderName: v.optional(v.string()),
    avatar: v.optional(v.string()),
    details: v.optional(v.any()),
    actions: v.optional(
      v.array(
        v.object({
          label: v.string(),
          type: v.union(v.literal("primary"), v.literal("secondary")),
          href: v.string()
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());
    const now = Date.now();
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      read: args.read ?? false,
      starred: args.starred ?? false,
      priority: args.priority,
      category: args.category,
      senderId: args.senderId,
      senderName: args.senderName,
      avatar: args.avatar,
      details: args.details,
      actions: args.actions,
      createdAt: now,
      updatedAt: now
    });
    return await ctx.db.get(notificationId);
  },
});

export const list = query({
  args: {
    userId: v.optional(v.id("users")),
    read: v.optional(v.boolean()),
    category: v.optional(v.string()),
    priority: v.optional(v.string()),
    email: v.optional(v.string()), // Add email to the validator
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("notifications");
    query = filter(
      query,
      (notification) => {
        const userIdCheck = args.userId ? notification.userId === args.userId : true;
        const readCheck = args.read !== undefined ? notification.read === args.read : true;
        const categoryCheck = args.category ? notification.category === args.category : true;
        const priorityCheck = args.priority ? notification.priority === args.priority : true;
        const notDeleted = !notification.deletedAt;
        return userIdCheck && readCheck && categoryCheck && priorityCheck && notDeleted;
      }
    );
    const results = await query
      .order("desc")
      .paginate(args.paginationOpts);

    return results;
  },
});

export const get = query({
  args: { id: v.id('notifications') },
  handler: async (ctx, args) => {
    const notification = await ctx.db.get(args.id);
    if (!notification) throw new ConvexError(getNotFoundErrorMessage("Notification"));
    return notification;
  }
});

export const markAsRead = mutation({
  args: {
    id: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());
    const notification = await ctx.db.get(id);
    if (!notification) throw new ConvexError(getNotFoundErrorMessage("Notification"));
    // Only allow the user who owns the notification to mark it as read
    if (notification.userId !== user._id) throw new ConvexError(getAuthorizationErrorMessage());
    await ctx.db.patch(id, { read: true, updatedAt: Date.now() });
    return await ctx.db.get(id);
  },
});

export const markAsUnread = mutation({
  args: {
    id: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());
    const notification = await ctx.db.get(id);
    if (!notification) throw new ConvexError(getNotFoundErrorMessage("Notification"));
    // Only allow the user who owns the notification to mark it as unread
    if (notification.userId !== user._id) throw new ConvexError(getAuthorizationErrorMessage());
    await ctx.db.patch(id, { read: false, updatedAt: Date.now() });
    return await ctx.db.get(id);
  },
});

export const markAllAsRead = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());
    if (userId !== user._id) throw new ConvexError(getAuthorizationErrorMessage());
    const notifications = await ctx.db
      .query("notifications")
      .filter(q => q.eq(q.field("userId"), userId))
      .filter(q => q.eq(q.field("read"), false))
      .filter(q => q.or(q.eq(q.field("deletedAt"), undefined), q.eq(q.field("deletedAt"), null)))
      .collect();
    for (const notification of notifications) {
      await ctx.db.patch(notification._id, { read: true, updatedAt: Date.now() });
    }
    return { success: true, count: notifications.length };
  },
});

export const remove = mutation({
  args: {
    id: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());
    const notification = await ctx.db.get(id);
    if (!notification) throw new ConvexError(getNotFoundErrorMessage("Notification"));
    // Only allow the user who owns the notification to delete it
    if (notification.userId && notification.userId !== user._id) {
      throw new ConvexError(getAuthorizationErrorMessage());
    }
    // Soft delete: set deletedAt timestamp
    await ctx.db.patch(id, { deletedAt: Date.now(), updatedAt: Date.now() });
    return { success: true };
  },
});

export const star = mutation({
  args: {
    id: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());
    const notification = await ctx.db.get(id);
    if (!notification) throw new ConvexError(getNotFoundErrorMessage("Notification"));
    // Only allow the user who owns the notification to mark it as starred
    if (notification.userId !== user._id) throw new ConvexError(getAuthorizationErrorMessage());
    await ctx.db.patch(id, { starred: !notification.starred, updatedAt: Date.now() });
    return await ctx.db.get(id);
  },
});
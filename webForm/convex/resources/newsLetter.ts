import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

// Mutation to subscribe an email
export const subscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("newsLetter")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new ConvexError("This email is already subscribed.");
    }

    // Insert new email
    const id = await ctx.db.insert("newsLetter", { email: args.email });
    return { id, email: args.email };
  },
});

// Query to list all subscribers
export const listSubscribers = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("newsLetter")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

// Mutation to unsubscribe an email
export const unsubscribe = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("newsLetter")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!existing) {
      throw new ConvexError("Email not found in subscriptions.");
    }

    await ctx.db.delete(existing._id);
    return { message: "Successfully unsubscribed." };
  },
});

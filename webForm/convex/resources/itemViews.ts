import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const trackView = mutation({
  args: {
    userId: v.id("users"),
    listingId: v.id("listing"),
  },
  handler: async (ctx, args) => {
    const { userId, listingId } = args;
    const now = Date.now();
    
    // Check if this user has already viewed this listing
    const existingView = await ctx.db
      .query("itemViews")
      .withIndex("by_user_listing", (q) => 
        q.eq("userId", userId).eq("listingId", listingId)
      )
      .first();

    if (existingView) {
      // Increment total views
      return await ctx.db.patch(existingView._id, {
        views: (existingView.views || 0) + 1,
        updatedAt: now,
      });
    } else {
      // This is a unique user-listing view
      return await ctx.db.insert("itemViews", {
        userId,
        listingId,
        views: 1,
        isUniqueCounted: true,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});



export const getListingViews = query({
  args: {
    listingId: v.id("listing"),
  },
  handler: async (ctx, args) => {
    const views = await ctx.db
      .query("itemViews")
      .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
      .collect();

    return {
      totalViews: views.reduce((total, view) => total + (view.views || 0), 0),
      uniqueViews: views.filter(view => view.isUniqueCounted).length,
    };
  },
});

export const getUserListingViews = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("itemViews")
      .withIndex("by_user_listing", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getPopularListings = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const allViews = await ctx.db.query("itemViews").collect();
    
    // Aggregate views by listing
    const listingViews = new Map();
    for (const view of allViews) {
      const current = listingViews.get(view.listingId) || 0;
      listingViews.set(view.listingId, current + (view.views || 0));
    }

    // Sort by view count and get top N
    const sortedListings = Array.from(listingViews.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    // Get listing details
    return await Promise.all(
      sortedListings.map(async ([listingId, views]) => {
        const listing = await ctx.db.get(listingId);
        return {
          listingId,
          ...listing,
          views,
        };
      })
    );
  },
});
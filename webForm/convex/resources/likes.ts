import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

export const toggleLike = mutation({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const { userId, productId } = args;
    const now = Date.now();
    
    // Check if like already exists
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_user_product", (q) => 
        q.eq("userId", userId).eq("productId", productId)
      )
      .first();

    if (existingLike) {
      // Unlike: Remove the like
      await ctx.db.delete(existingLike._id);
      return { liked: false };
    } else {
      // Like: Create new like
      await ctx.db.insert("likes", {
        userId,
        productId,
        createdAt: now,
        updatedAt: now,
      });
      return { liked: true };
    }
  },
});

export const isLiked = query({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const like = await ctx.db
      .query("likes")
      .withIndex("by_user_product", (q) => 
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .first();
    
    return { liked: !!like };
  },
});

export const getProductLikes = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    return likes.length;
  },
});

export const getUserLikes = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("likes")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getMostLikedProducts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const allLikes = await ctx.db.query("likes").collect();
    
    // Count likes per product
    const productLikeCounts = new Map();
    for (const like of allLikes) {
      const current = productLikeCounts.get(like.productId) || 0;
      productLikeCounts.set(like.productId, current + 1);
    }

    // Sort by like count and get top N
    const sortedProducts = Array.from(productLikeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    // Get product details
    return await Promise.all(
      sortedProducts.map(async ([productId, likeCount]) => {
        const product = await ctx.db.get(productId);
        return {
          productId,
          ...product,
          likeCount,
        };
      })
    );
  },
});
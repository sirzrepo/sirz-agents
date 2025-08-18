import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { filter } from "convex-helpers/server/filter";
import { paginationOptsValidator } from "convex/server";

/**
 * Create a new product review or update existing one if user already reviewed
 */
export const createOrUpdate = mutation({
    args: {
        productId: v.id('products'),
        userId: v.id('users'),
        comment: v.string(),
        rating: v.number(),
    },
    handler: async (ctx, args) => {
        // Ensure rating is between 1 and 5
        const rating = Math.max(1, Math.min(5, args.rating));
        
        // Check if user already reviewed this product
        const existingReview = await ctx.db
            .query('productReviews')
            .withIndex('by_user_product', (q) => 
                q.eq('userId', args.userId)
                 .eq('productId', args.productId)
            )
            .first();

        if (existingReview) {
            // Update existing review
            await ctx.db.patch(existingReview._id, {
                comment: args.comment,
                rating,
                updatedAt: Date.now(),
            });
            return await ctx.db.get(existingReview._id);
        }

        // Create new review
        const reviewId = await ctx.db.insert('productReviews', {
            productId: args.productId,
            userId: args.userId,
            comment: args.comment,
            rating,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return await ctx.db.get(reviewId);
    },
});

/**
 * Get user's review for a specific product
 */
export const getUserReview = query({
    args: {
        productId: v.id('products'),
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query('productReviews')
            .withIndex('by_user_product', (q) => 
                q.eq('userId', args.userId)
                 .eq('productId', args.productId)
            )
            .first();
    },
});

/**
 * List reviews with optional filtering by product or user
 */
export const list = query({
    args: {
        productId: v.optional(v.id('products')),
        userId: v.optional(v.id('users')),
        minRating: v.optional(v.number()),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const { productId, userId, minRating, paginationOpts } = args;

        const reviews = await filter(
            ctx.db.query('productReviews'),
            (review) => {
                if (productId && review.productId !== productId) return false;
                if (userId && review.userId !== userId) return false;
                if (minRating && review.rating < minRating) return false;
                return true;
            }
        ).order('desc')
        .paginate(paginationOpts);

        return reviews;
    },
});

/**
 * Get a review by ID
 */
export const get = query({
    args: {
        id: v.id('productReviews'),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

/**
 * Update a review
 */
export const update = mutation({
    args: {
        id: v.id('productReviews'),
        comment: v.optional(v.string()),
        rating: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        
        // If updating rating, ensure it's between 1 and 5
        if (updates.rating !== undefined) {
            updates.rating = Math.max(1, Math.min(5, updates.rating));
        }
        
        await ctx.db.patch(id, updates);
        return await ctx.db.get(id);
    },
});

/**
 * Delete a review
 */
export const remove = mutation({
    args: {
        id: v.id('productReviews'),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return true;
    },
});

/**
 * Get all reviews by a specific user
 */
export const getByUserId = query({
    args: {
        userId: v.id('users'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const reviews = await ctx.db
            .query("productReviews")
            .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();

        // Get product details for each review
        const reviewsWithProducts = await Promise.all(
            reviews.map(async (review) => {
                const product = await ctx.db.get(review.productId);
                return {
                    ...review,
                    product: product ? {
                        _id: product._id,
                        name: product.name,
                        image: product.image
                    } : null
                };
            })
        );

        return reviewsWithProducts;
    },
});

// Get multiple products' rating stats in one query
export const getMultipleProductsRatingStats = query({
    args: {
      productIds: v.array(v.id('products')),
    },
    handler: async (ctx, args) => {
      // Optional: Return empty if no IDs provided
      if (args.productIds.length === 0) return {};
  
      const result: Record<string, {
        average: number;
        count: number;
        distribution: Record<1 | 2 | 3 | 4 | 5, number>;
        hasReviews: boolean;
      }> = {};
  
      // Fetch all reviews for each productId
      const allReviews = await Promise.all(
        args.productIds.map(productId =>
          ctx.db
            .query('productReviews')
            .withIndex('by_product_id', (q) =>
              q.eq('productId', productId)
            )
            .collect()
        )
      );
  
      const reviews = allReviews.flat();
  
      // Group reviews by productId (as string)
      const reviewsByProduct = reviews.reduce((acc, review) => {
        const key = review.productId.toString();
        if (!acc[key]) acc[key] = [];
        acc[key].push(review);
        return acc;
      }, {} as Record<string, typeof reviews>);
  
      // Calculate stats for each product
      for (const productId of args.productIds) {
        const key = productId.toString();
        const productReviews = reviewsByProduct[key] || [];
  
        if (productReviews.length === 0) {
          result[key] = {
            average: 0,
            count: 0,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            hasReviews: false
          };
          continue;
        }
  
        const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
        const average = totalRating / productReviews.length;
  
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        productReviews.forEach(review => {
          const rating = review.rating as 1 | 2 | 3 | 4 | 5;
          distribution[rating]++;
        });
  
        result[key] = {
          average: parseFloat(average.toFixed(1)), // Fixed to 1 decimal
          count: productReviews.length,
          distribution,
          hasReviews: true
        };
      }
  
      return result;
    },
  });
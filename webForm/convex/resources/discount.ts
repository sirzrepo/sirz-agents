import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { getAuthenticatedUser, getAuthenticationErrorMessage, getAuthorizationErrorMessage, getNotFoundErrorMessage } from "../helpers";
import { filter } from "convex-helpers/server/filter";
import { paginationOptsValidator } from "convex/server";

/**
 * Generate a new discount code for a user
 */
export const generateCode = mutation({
  args: {
    userId: v.optional(v.id("users")),
    value: v.optional(v.number()),
    code: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    // Use the authenticated user's ID if no userId is provided
    const userId = args.userId || user._id;

    // Check if user already has a discount code
    const existingDiscount = await ctx.db
      .query("discount")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingDiscount && existingDiscount.code && !existingDiscount.usedAt) {
      // User already has an unused code
      return existingDiscount;
    }

    // Use the provided code or generate a default one
    const code = args.code || "WELCOME-10";

    // If user already has a discount entry, update it with new code
    if (existingDiscount) {
      const updatedDiscount = await ctx.db.patch(existingDiscount._id, {
        code,
        usedAt: undefined,
      });
      return updatedDiscount;
    }

    // Create a new discount entry for the user
    const discountId = await ctx.db.insert("discount", {
      userId,
      code,
      value: args.value,
      usedAt: undefined,
    });

    return await ctx.db.get(discountId);
  },
});

/**
 * Get a user's discount code
 */
export const getUserCode = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    // Use the authenticated user's ID if no userId is provided
    const userId = args.userId || user._id;

    // Only allow users to view their own discount codes
    if (userId !== user._id) {
      throw new ConvexError(getAuthorizationErrorMessage());
    }

    // Get all user's discount codes and filter out used ones
    const discounts = await ctx.db
      .query("discount")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Return the first unused discount code or undefined if none found
    return discounts.find(d => !d.usedAt);
  },
});

/**
 * Verify if a discount code is valid without marking it as used
 */
export const useCode = mutation({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const { code } = args;
    const user = await getAuthenticatedUser(ctx);

    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    // Find the discount with the given code
    const discount = await ctx.db
      .query("discount")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    if (!discount) {
      throw new ConvexError("Invalid discount code");
    }

    // Verify the code exists and is assigned to a user
    // if (!discount.userId) {
    //   throw new ConvexError("Invalid discount code");
    // }

    // Check if the code has already been used
    if (discount.usedAt) {
      throw new ConvexError("This discount code has already been used");
    }

    // Verify the discount belongs to the current user
    // if (discount.userId !== user._id) {
    //   throw new ConvexError("This discount code is not valid for your account");
    // }

    return {
      success: true,
      discount: {
        ...discount,
        usedAt: undefined
      },
    };
  },
});
/**
 * Mark a discount code as used (to be called after successful payment)
 */
export const markCodeAsUsed = mutation({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const { code } = args;
    const user = await getAuthenticatedUser(ctx);

    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    // Find the discount with the given code
    const discount = await ctx.db
      .query("discount")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    if (!discount) {
      throw new ConvexError("Invalid discount code");
    }

    // Verify the code exists and is assigned to a user
    if (!discount.userId) {
      throw new ConvexError("Invalid discount code");
    }

    // Mark the discount code as used
    const update = { usedAt: Date.now() };
    const updatedDiscount = await ctx.db.patch(discount._id, update);

    return {
      success: true,
      discount: updatedDiscount,
    };
  },
});

/**
 * Admin function to list all discount codes
 */
export const listAll = query({
  args: {
    paginationOpts: paginationOptsValidator,
    includeUsed: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    // Check if user is an admin (you may need to adjust this based on your user roles)
    // if (!user.isAdmin) {
    //   throw new ConvexError(getAuthorizationErrorMessage());
    // }

    let query = ctx.db.query("discount");

    if (args.includeUsed === false) {
      query = filter(query, (discount) => {
        return discount.usedAt === undefined;
      });
    }

    const results = await query
      .order("desc")
      .paginate(args.paginationOpts);

    return results;
  },
});

/**
 * Delete a discount code
 */
export const remove = mutation({
  args: {
    id: v.id("discount"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    const user = await getAuthenticatedUser(ctx);

    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    const discount = await ctx.db.get(id);
    if (!discount) throw new ConvexError(getNotFoundErrorMessage("Discount"));

    // // Only allow the user who owns the discount or an admin to delete it
    // if (discount.userId !== user._id && !user.isAdmin) {
    //   throw new ConvexError(getAuthorizationErrorMessage());
    // }

    await ctx.db.delete(id);
    
    return { success: true };
  },
});
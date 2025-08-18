import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { paginationOptsValidator, PaginationResult } from "convex/server";
import { Doc, Id } from "../_generated/dataModel";
import { getImageUrl, getNotFoundErrorMessage } from "../helpers";

// Basic types
type Wishlist = Doc<"wishlists">;
type Product = Doc<"products">;

// Extended types for the response
interface EnrichedProduct extends Omit<Product, 'image'> {
  image?: Id<"_storage"> | undefined;
  imageUrl?: string | null;
}

interface EnrichedWishlist extends Wishlist {
  product?: EnrichedProduct | undefined;
}

// Add a product to a user's wishlist
export const addToWishlist = mutation({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
  },
  handler: async (ctx, args): Promise<Id<"wishlists"> | null> => {
    const { userId, productId } = args;

    // Check if the product exists
    const product = await ctx.db.get(productId);
    if (!product) {
      throw new ConvexError(getNotFoundErrorMessage("product"));
    }

    // Check if the product is already in the user's wishlist
    const existingWishlistItem = await ctx.db
      .query("wishlists")
      .withIndex("by_user_and_product", (q) =>
        q.eq("userId", userId).eq("productId", productId)
      )
      .first();

    // If it already exists, return the existing ID
    if (existingWishlistItem) {
      return existingWishlistItem._id;
    }

    // Otherwise, add it to the wishlist
    return await ctx.db.insert("wishlists", {
      userId,
      productId,
    });
  },
});

// Remove a product from a user's wishlist
export const removeFromWishlist = mutation({
  args: {
    id: v.id("wishlists"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    
    // Check if the wishlist item exists
    const wishlistItem = await ctx.db.get(id);
    if (!wishlistItem) {
      throw new ConvexError(getNotFoundErrorMessage("wishlist item"));
    }
    
    // Delete the wishlist item
    await ctx.db.delete(id);
    return true;
  },
});

// Remove a product from a user's wishlist by product ID
export const removeProductFromWishlist = mutation({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const { userId, productId } = args;
    
    // Find the wishlist item
    const wishlistItem = await ctx.db
      .query("wishlists")
      .withIndex("by_user_and_product", (q) =>
        q.eq("userId", userId).eq("productId", productId)
      )
      .first();
    
    if (!wishlistItem) {
      throw new ConvexError(getNotFoundErrorMessage("wishlist item"));
    }
    
    // Delete the wishlist item
    await ctx.db.delete(wishlistItem._id);
    return true;
  },
});

// Get a paginated list of a user's wishlist items with product details
export const getUserWishlist = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args): Promise<PaginationResult<EnrichedWishlist>> => {
    const { userId, paginationOpts } = args;

    const results = await ctx.db
      .query("wishlists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .paginate(paginationOpts);

    // Fetch product details for each wishlist item
    const enrichedItems = await Promise.all(
      results.page.map(async (wishlistItem) => {
        // Base wishlist item without product details
        const enrichedItem: EnrichedWishlist = { ...wishlistItem };
        
        // If no product ID, return just the wishlist item
        if (!wishlistItem.productId) {
          return enrichedItem;
        }

        // Get the product details
        const product = await ctx.db.get(wishlistItem.productId);
        if (!product) {
          return enrichedItem;
        }

        // Get image URL if product has an image
        let imageUrl: string | null = null;
        if (product.image) {
          try {
            imageUrl = await getImageUrl(ctx, product.image);
          } catch (error) {
            // If image URL retrieval fails, continue without it
            console.error("Error getting image URL:", error);
          }
        }
        
        // Add product details to the wishlist item
        enrichedItem.product = {
          ...product,
          imageUrl
        };
        
        return enrichedItem;
      })
    );

    return {
      ...results,
      page: enrichedItems,
    };
  },
});

// Check if a product is in a user's wishlist
export const isProductInWishlist = query({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const { userId, productId } = args;

    const wishlistItem = await ctx.db
      .query("wishlists")
      .withIndex("by_user_and_product", (q) =>
        q.eq("userId", userId).eq("productId", productId)
      )
      .first();

    return {
      inWishlist: !!wishlistItem,
      wishlistItemId: wishlistItem ? wishlistItem._id : null,
    };
  },
});

// Count the number of items in a user's wishlist
export const countUserWishlistItems = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Using collect() and length instead of count() to avoid TypeScript issues
    const wishlistItems = await ctx.db
      .query("wishlists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return { count: wishlistItems.length };
  },
});

// Clear all items from a user's wishlist
export const clearWishlist = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    const wishlistItems = await ctx.db
      .query("wishlists")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Delete all wishlist items for the user
    await Promise.all(wishlistItems.map((item) => ctx.db.delete(item._id)));

    return { success: true, itemsRemoved: wishlistItems.length };
  },
});
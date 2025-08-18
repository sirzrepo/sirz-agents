import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import {
  getAuthenticatedUser,
  getAuthenticationErrorMessage,
  getNotFoundErrorMessage,
} from "../helpers";
import { filter } from "convex-helpers/server/filter";
import { paginationOptsValidator } from "convex/server";

// Create or update merchant profile
export const upsert = mutation({
  args: {
    businessName: v.optional(v.string()),
    type: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    documentDetails: v.optional(v.object({
      identityType: v.optional(v.string()),
      identityNumber: v.optional(v.string()),
      identityDocumentUrl: v.optional(v.string()),
      businessLogoUrl: v.optional(v.string()),
    })),
    bankDetails: v.optional(v.object({
      bankName: v.optional(v.string()),
      accountNumber: v.optional(v.string()),
      accountName: v.optional(v.string()),
    })),
    address: v.optional(v.object({
      street: v.optional(v.string()),
      region: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      country: v.optional(v.string()),
      postalCode: v.optional(v.string()),
      contact: v.optional(v.string()),
      whatsapp: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    // Check if merchant profile already exists
    const existing = await ctx.db
      .query("merchant")
      .withIndex("userId", q => q.eq("userId", user._id))
      .first();

    const data = {
      ...args,
      userId: user._id,
      isActive: true,
      verified: existing?.verified || false,
      rating: existing?.rating || 0,
      listingCount: existing?.listingCount || 0,
      totalSales: existing?.totalSales || 0,
    };

    if (existing) {
      // Update existing merchant
      await ctx.db.patch(existing._id, data);
      return await ctx.db.get(existing._id);
    } else {
      // Create new merchant
      return await ctx.db.insert("merchant", data);
    }
  },
});

// Get merchant by ID
export const get = query({
  args: { id: v.optional(v.id("merchant")) },
  handler: async (ctx, args) => {
    if (args.id) {
      // Get specific merchant by ID
      return await ctx.db.get(args.id);
    } else {
      // Get current user's merchant profile
      const user = await getAuthenticatedUser(ctx);
      if (!user) throw new ConvexError(getAuthenticationErrorMessage());
      
      return await ctx.db
        .query("merchant")
        .withIndex("userId", q => q.eq("userId", user._id))
        .first();
    }
  },
});

// List merchants with filters
export const list = query({
  args: {
    searchQuery: v.optional(v.string()),
    type: v.optional(v.string()),
    verified: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    region: v.optional(v.string()),
    state: v.optional(v.string()),
    country: v.optional(v.string()),
    minRating: v.optional(v.number()),
    minListings: v.optional(v.number()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("merchant");
    
    // Apply filters
    query = filter(query, (merchant: any) => {
      const searchCheck = args.searchQuery 
        ? merchant.businessName?.toLowerCase().includes(args.searchQuery.toLowerCase()) ||
          merchant.email?.toLowerCase().includes(args.searchQuery.toLowerCase()) ||
          merchant.phone?.includes(args.searchQuery)
        : true;
      
      const typeCheck = args.type ? merchant.type === args.type : true;
      const verifiedCheck = typeof args.verified !== 'undefined' 
        ? merchant.verified === args.verified 
        : true;
      const activeCheck = typeof args.isActive !== 'undefined' 
        ? merchant.isActive === args.isActive 
        : true;
      const ratingCheck = args.minRating ? (merchant.rating || 0) >= args.minRating : true;
      const listingsCheck = args.minListings ? (merchant.listingCount || 0) >= args.minListings : true;
      const regionCheck = args.region ? merchant.address?.region === args.region : true;
      const stateCheck = args.state ? merchant.address?.state === args.state : true;
      const countryCheck = args.country ? merchant.address?.country === args.country : true;

      return searchCheck && typeCheck && verifiedCheck && activeCheck && 
             ratingCheck && listingsCheck && regionCheck && stateCheck && countryCheck;
    });

    return await query.order("desc").paginate(args.paginationOpts);
  },
});

// Update merchant verification status (admin only)
export const updateVerification = mutation({
  args: {
    merchantId: v.id("merchant"),
    verified: v.boolean(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());
    
    // TODO: Add admin check
    // if (user.role !== 'admin') {
    //   throw new ConvexError("Only admins can update verification status");
    // }

    const merchant = await ctx.db.get(args.merchantId);
    if (!merchant) throw new ConvexError("Merchant not found");

    await ctx.db.patch(args.merchantId, { 
      verified: args.verified,
    //   verificationReason: args.reason,
    });
    
    return await ctx.db.get(args.merchantId);
  },
});

// Update merchant status (active/inactive)
export const updateStatus = mutation({
  args: {
    merchantId: v.id("merchant"),
    isActive: v.boolean(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());
    
    // TODO: Add admin or self check
    // const merchant = await ctx.db.get(args.merchantId);
    // if (merchant.userId !== user._id && user.role !== 'admin') {
    //   throw new ConvexError("Unauthorized to update this merchant's status");
    // }

    await ctx.db.patch(args.merchantId, { 
      isActive: args.isActive,
    //   statusReason: args.reason,
    });
    
    return await ctx.db.get(args.merchantId);
  },
});

// Get merchant statistics
export const getStats = query({
  args: { merchantId: v.id("merchant") },
  handler: async (ctx, args) => {
    const merchant = await ctx.db.get(args.merchantId);
    if (!merchant) throw new ConvexError("Merchant not found");

    // TODO: Implement actual statistics calculation
    // For now, returning basic stats from merchant document
    return {
      totalListings: merchant.listingCount || 0,
      totalSales: merchant.totalSales || 0,
      averageRating: merchant.rating || 0,
      verified: merchant.verified || false,
      isActive: merchant.isActive !== false, // Default to true if not set
    };
  },
});

// Get merchant by user ID
export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("merchant")
      .withIndex("userId", q => q.eq("userId", args.userId))
      .first();
  },
});

// Delete merchant (soft delete)
export const remove = mutation({
  args: { merchantId: v.id("merchant") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    const merchant = await ctx.db.get(args.merchantId);
    if (!merchant) throw new ConvexError("Merchant not found");

    // Only allow merchant or admin to delete
    if (merchant.userId !== user._id) {
      // TODO: Add admin check
      // if (user.role !== 'admin') {
      throw new ConvexError("You don't have permission to delete this merchant profile");
      // }
    }

    // Soft delete by marking as inactive
    await ctx.db.patch(args.merchantId, { 
      isActive: false,
    //   deletedAt: Date.now(),
    });

    return { success: true };
  },
});
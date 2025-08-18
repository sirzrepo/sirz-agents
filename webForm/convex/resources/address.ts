import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { getAuthenticatedUser, getAuthenticationErrorMessage, getNotFoundErrorMessage } from "../helpers";
import { paginationOptsValidator } from "convex/server";

// Create a new address for the authenticated user
export const create = mutation({
  args: {
    street: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    country: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    // If this is the default address, unset any existing default addresses
    if (args.isDefault) {
      const existingAddresses = await ctx.db
        .query("address")
        .withIndex("by_user_id", (q) => q.eq("userId", user._id))
        .collect();

      // Update any existing default addresses to not be default
      for (const address of existingAddresses) {
        if (address.isDefault) {
          await ctx.db.patch(address._id, { isDefault: false });
        }
      }
    }

    // Create the new address
    const addressId = await ctx.db.insert("address", {
      userId: user._id,
      ...args,
    });

    return await ctx.db.get(addressId);
  },
});

// Get all addresses for the authenticated user
export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    return await ctx.db
      .query("address")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

// Get a specific address by ID
export const get = query({
  args: { id: v.id("address") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    const address = await ctx.db.get(args.id);
    if (!address) throw new ConvexError(getNotFoundErrorMessage("Address"));
    
    // Ensure the user can only access their own addresses
    if (address.userId !== user._id) {
      throw new ConvexError("You do not have permission to view this address");
    }

    return address;
  },
});

// Update an existing address
export const update = mutation({
  args: {
    id: v.id("address"),
    label: v.optional(v.string()),
    street: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    country: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    isDefault: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    const address = await ctx.db.get(id);
    if (!address) throw new ConvexError(getNotFoundErrorMessage("Address"));
    
    // Ensure the user can only update their own addresses
    if (address.userId !== user._id) {
      throw new ConvexError("You do not have permission to update this address");
    }

    // If setting this address as default, unset any other default addresses
    if (updates.isDefault) {
      const existingAddresses = await ctx.db
        .query("address")
        .withIndex("by_user_id", (q) => q.eq("userId", user._id))
        .collect();

      // Update any existing default addresses to not be default
      for (const addr of existingAddresses) {
        if (addr._id !== id && addr.isDefault) {
          await ctx.db.patch(addr._id, { isDefault: false });
        }
      }
    }

    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});

// Set an address as the default
export const setAsDefault = mutation({
  args: { id: v.id("address") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    const address = await ctx.db.get(args.id);
    if (!address) throw new ConvexError(getNotFoundErrorMessage("Address"));
    
    // Ensure the user can only update their own addresses
    if (address.userId !== user._id) {
      throw new ConvexError("You do not have permission to update this address");
    }

    // Unset any existing default addresses
    const existingAddresses = await ctx.db
      .query("address")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .collect();

    // Update any existing default addresses to not be default
    for (const addr of existingAddresses) {
      if (addr._id !== args.id && addr.isDefault) {
        await ctx.db.patch(addr._id, { isDefault: false });
      }
    }

    // Set this address as default
    await ctx.db.patch(args.id, { isDefault: true });
    return await ctx.db.get(args.id);
  },
});

// Delete an address
export const remove = mutation({
  args: { id: v.id("address") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    const address = await ctx.db.get(args.id);
    if (!address) throw new ConvexError(getNotFoundErrorMessage("Address"));
    
    // Ensure the user can only delete their own addresses
    if (address.userId !== user._id) {
      throw new ConvexError("You do not have permission to delete this address");
    }

    await ctx.db.delete(args.id);
  },
});

// Get the default address for the authenticated user
export const getDefault = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    const defaultAddress = await ctx.db
      .query("address")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("isDefault"), true))
      .first();

    if (!defaultAddress) {
      // If no default address is set, return the most recently created address
      return await ctx.db
        .query("address")
        .withIndex("by_user_id", (q) => q.eq("userId", user._id))
        .order("desc")
        .first();
    }

    return defaultAddress;
  },
});
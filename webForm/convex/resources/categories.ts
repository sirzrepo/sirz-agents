import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { filter } from "convex-helpers/server/filter";

// Create a new category
export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", {
      name: args.name,
      updatedAt: Date.now(),
    });
  },
});

// Get all categories with pagination
export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { name, paginationOpts } = args;
    const query = ctx.db.query("categories");

    return await filter(
      query,
      (category) => {
        const nameCheck = name
          ? category.name.toLowerCase().includes(name.toLowerCase())
          : true;
        return nameCheck;
      },
    )
      .order("desc")
      .paginate(paginationOpts);
  },
});

// Get all categories without pagination
export const listAll = query({
  args: {
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const query = ctx.db.query("categories");
    
    return await filter(
      query,
      (category) => {
        const nameCheck = args.name
          ? category.name.toLowerCase().includes(args.name.toLowerCase())
          : true;
        return nameCheck;
      },
    )
      .order("desc")
      .collect();
  },
});

// Get a single category by ID
export const get = query({
  args: {
    id: v.id("categories"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Update a category
export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    if (Object.keys(updates).length === 0) {
      throw new Error("No updates provided");
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete a category
export const remove = mutation({
  args: {
    id: v.id("categories"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

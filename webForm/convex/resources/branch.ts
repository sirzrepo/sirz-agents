import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { filter } from "convex-helpers/server/filter";

// Address type definition for reuse
const addressSchema = v.object({
  street: v.optional(v.string()),
  region: v.optional(v.string()),
  city: v.optional(v.string()),
  state: v.optional(v.string()),
  country: v.optional(v.string()),
  postalCode: v.optional(v.string()),
  contact: v.optional(v.string()),
  latitude: v.optional(v.number()),
  longitude: v.optional(v.number()),
});

// create branch
export const create = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    isHeadOffice: v.optional(v.boolean()),
    address: v.optional(addressSchema),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("branch", {
      name: args.name,
      phone: args.phone,
      email: args.email,
      isActive: args.isActive ?? true,
      address: args.address,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// get all branches
export const list = query({
  args: {
    isActive: v.optional(v.boolean()),
    name: v.optional(v.string()),
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    const { isActive, name, paginationOpts } = args;
    const query = ctx.db.query("branch");

    return await filter(
      query,
      (branch) => {
        const activeCheck = isActive !== undefined
          ? branch.isActive === isActive
          : true;

        const nameCheck = name !== undefined
          ? branch.name.toLowerCase().includes(name.toLowerCase())
          : true;

        return activeCheck && nameCheck;
      },
    ).paginate(paginationOpts);
  },
});

// get all branches without pagination
export const listAll = query({
  args: {
    isActive: v.optional(v.boolean()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { isActive, name } = args;
    const query = ctx.db.query("branch");

    return await filter(
      query,
      (branch) => {
        const activeCheck = isActive !== undefined
          ? branch.isActive === isActive
          : true;

        const nameCheck = name !== undefined
          ? branch.name.toLowerCase().includes(name.toLowerCase())
          : true;

        return activeCheck && nameCheck;
      },
    ).collect();
  },
});

// get branch by id
export const get = query({
  args: {
    id: v.id("branch"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// update branch
export const update = mutation({
  args: {
    id: v.id("branch"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    isHeadOffice: v.optional(v.boolean()),
    address: v.optional(addressSchema),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const now = new Date().toISOString();
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: now,
    });
  },
});

// delete branch
export const deleteBranch = mutation({
  args: {
    id: v.id("branch"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

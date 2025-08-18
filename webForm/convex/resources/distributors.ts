import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import {
  getAuthenticatedUser,
  getAuthenticationErrorMessage,
  getAuthorizationErrorMessage,
  getNotFoundErrorMessage,
} from "../helpers";
import { filter } from "convex-helpers/server/filter";
import { paginationOptsValidator } from "convex/server";

export const create = mutation({
  args: {
    businessName: v.string(),
    address: v.string(),
    region: v.string(),
    city: v.string(),
    state: v.string(),
    country: v.optional(v.string()),
    contact: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    const distributorId = await ctx.db.insert("distributors", {
      ...args,
      createdBy: user._id,
    });

    return await ctx.db.get(distributorId);
  },
});

export const list = query({
  args: {
    searchQuery: v.optional(v.string()),
    region: v.optional(v.string()),
    state: v.optional(v.string()),
    country: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { searchQuery, region, state, country } = args;
    let query = ctx.db.query("distributors");

    query = filter(query, (distributor) => {
      const searchQueryCheck = searchQuery
        ? distributor.businessName.includes(searchQuery)
        : true;
      const regionCheck = region ? distributor.region === region : true;
      const stateCheck = state ? distributor.state === state : true;
      const countryCheck = country ? distributor.country === country : true;

      return searchQueryCheck && regionCheck && stateCheck && countryCheck;
    });

    return await query.order("desc").paginate(args.paginationOpts);
  },
});

export const get = query({
  args: { id: v.id("distributors") },
  handler: async (ctx, args) => {
    const distributor = await ctx.db.get(args.id);
    if (!distributor) throw new ConvexError(getNotFoundErrorMessage("Distributor"));
    return distributor;
  },
});

export const update = mutation({
  args: {
    id: v.id("distributors"),
    businessName: v.optional(v.string()),
    address: v.optional(v.string()),
    region: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    country: v.optional(v.string()),
    contact: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    const distributor = await ctx.db.get(id);
    if (!distributor) throw new ConvexError(getNotFoundErrorMessage("Distributor"));

    if (distributor.createdBy !== user._id) throw new ConvexError(getAuthorizationErrorMessage());

    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("distributors") },
  handler: async (ctx, args) => {
    const { id } = args;
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    const distributor = await ctx.db.get(id);
    if (!distributor) throw new ConvexError(getNotFoundErrorMessage("Distributor"));

    if (distributor.createdBy !== user._id) throw new ConvexError(getAuthorizationErrorMessage());

    await ctx.db.delete(id);
  },
});

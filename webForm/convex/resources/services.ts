import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { filter } from "convex-helpers/server/filter";

// Create a new service
export const create = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        price: v.string(),
    },
    handler: async (ctx, args) => {
        const { name, description, price } = args;

        return await ctx.db.insert("services", {
            name,
            description,
            price,
        });
    },
});

// Get paginated list of services
export const list = query({
    args: {
        searchQuery: v.optional(v.string()),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const { searchQuery, paginationOpts } = args;

        return await filter(
            ctx.db.query("services"),
            (service) => {
                const searchCheck = searchQuery
                    ? service.name.toLowerCase().includes(searchQuery.toLowerCase())
                    : true;
                return searchCheck;
            }
        )
            .order("desc")
            .paginate(paginationOpts);
    },
});

// Get a single service by ID
export const get = query({
    args: {
        id: v.id("services"),
    },
    handler: async (ctx, args) => {
        const { id } = args;

        return await ctx.db.get(id);
    },
});

// Update a service
export const update = mutation({
    args: {
        id: v.id("services"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;

        return await ctx.db.patch(id, fields);
    },
});

// Delete a service
export const remove = mutation({
    args: {
        id: v.id("services"),
    },
    handler: async (ctx, args) => {
        const { id } = args;

        return await ctx.db.delete(id);
    },
}); 
import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { filter } from "convex-helpers/server/filter";

export const create = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        active: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("departments", {
            name: args.name,
            description: args.description,
            active: args.active ?? true,
            updatedAt: Date.now(),
        });
    },
});

export const list = query({
    args: {
        active: v.optional(v.boolean()),
        name: v.optional(v.string()),
        paginationOpts: paginationOptsValidator
    },
    handler: async (ctx, args) => {
        const { active, name, paginationOpts } = args;

        const query = ctx.db.query("departments");

        return await filter(
            query,
            (department) => {
                const activeCheck = active !== undefined
                    ? department.active === active
                    : true;

                const nameCheck = name !== undefined
                    ? department.name.toLowerCase().includes(name.toLowerCase())
                    : true;

                return activeCheck && nameCheck;
            },
        ).paginate(paginationOpts);
    },
});

export const listAll = query({
    args: {
        active: v.optional(v.boolean()),
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { active, name } = args;

        const query = ctx.db.query("departments");

        return await filter(
            query,
            (department) => {
                const activeCheck = active !== undefined
                    ? department.active === active
                    : true;

                const nameCheck = name !== undefined
                    ? department.name.toLowerCase().includes(name.toLowerCase())
                    : true;

                return activeCheck && nameCheck;
            },
        ).collect();
    },
});

export const get = query({
    args: {
        id: v.id("departments"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const update = mutation({
    args: {
        id: v.id("departments"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        active: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        if (Object.keys(updates).length === 0) return new ConvexError("No updates provided");

        return await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now(),
        });
    },
});

export const deactivate = mutation({
    args: {
        id: v.id("departments"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.id, {
            active: false,
            updatedAt: Date.now(),
        });
    },
});

export const remove = mutation({
    args: {
        id: v.id("departments"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.id);
    },
});


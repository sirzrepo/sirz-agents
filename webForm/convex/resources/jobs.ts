import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { filter } from "convex-helpers/server/filter";
import { paginationOptsValidator } from "convex/server";

export const list = query({
    args: {
        paginationOpts: paginationOptsValidator,
        status: v.optional(v.string()),
        search: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const { paginationOpts, status, search } = args;

        const query = ctx.db.query("jobs");

        return await filter(
            query,
            (job) => {
                const statusCheck = status ? job.status === status : true;
                const searchCheck = search ? job.title.includes(search) : true;

                return statusCheck && searchCheck;
            },
        )
            .order('desc')
            .paginate(paginationOpts);
    },
});

export const get = query({
    args: { id: v.id("jobs") },
    handler: async (ctx, args) => {
        const job = await ctx.db.get(args.id);
        if (!job) throw new Error("Job not found");
        return job;
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        status: v.string(), // open, closed, draft
        openings: v.number(),
        deadline: v.optional(v.number()),
        department: v.optional(v.string()),
        startDate: v.optional(v.number()),
        endDate: v.optional(v.number()),
        employmentType: v.optional(v.string()),
        salaryFrom: v.optional(v.number()),
        salaryTo: v.optional(v.number()),
        salaryCurrency: v.optional(v.string()),
        salaryPeriod: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("jobs", args);
    },
});

export const update = mutation({
    args: {
        id: v.id("jobs"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        status: v.optional(v.string()),
        openings: v.optional(v.number()),
        deadline: v.optional(v.number()),
        department: v.optional(v.string()),
        startDate: v.optional(v.number()),
        endDate: v.optional(v.number()),
        employmentType: v.optional(v.string()),
        salaryFrom: v.optional(v.number()),
        salaryTo: v.optional(v.number()),
        salaryCurrency: v.optional(v.string()),
        salaryPeriod: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const existing = await ctx.db.get(id);
        if (!existing) throw new ConvexError("Job not found");
        return await ctx.db.patch(id, updates);
    },
});

export const remove = mutation({
    args: { id: v.id("jobs") },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.id);
        if (!existing) throw new Error("Job not found");
        await ctx.db.delete(args.id);
        return true;
    },
});

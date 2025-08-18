import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { filter } from "convex-helpers/server/filter";
import { paginationOptsValidator } from "convex/server";

export const create = mutation({
    args: {
        jobId: v.id('jobs'),
        name: v.string(),
        email: v.string(),
        phone: v.string(),
        resume: v.optional(v.id('_storage')),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let { status } = args
        if (!status) {
            status = 'pending'
        }
        return await ctx.db.insert('jobApplicants', {
            ...args,
            status
        });
    },
});

export const list = query({
    args: {
        jobId: v.optional(v.id('jobs')),
        status: v.optional(v.string()),
        email: v.optional(v.string()),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const { jobId, status, email, paginationOpts } = args;
        const query = ctx.db.query('jobApplicants');

        return await filter(
            query,
            (applicant) => {
                return (jobId ? applicant.jobId === jobId : true) &&
                    (status ? applicant.status === status : true) &&
                    (email ? applicant.email === email : true);
            },
        ).paginate(paginationOpts);
    },
});

export const getById = query({
    args: { id: v.id('jobApplicants') },
    handler: async (ctx, args) => {
        const applicant = await ctx.db.get(args.id);
        if (!applicant) throw new Error('Applicant not found');
        return applicant;
    },
});

export const update = mutation({
    args: {
        id: v.id('jobApplicants'),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        resume: v.optional(v.id('_storage')),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const existing = await ctx.db.get(id);
        if (!existing) throw new Error('Applicant not found');
        return await ctx.db.patch(id, updates);
    },
});

export const remove = mutation({
    args: { id: v.id('jobApplicants') },
    handler: async (ctx, args) => {
        const existing = await ctx.db.get(args.id);
        if (!existing) throw new ConvexError('Applicant not found');
        await ctx.db.delete(args.id);
        return true;
    },
});
import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { filter } from "convex-helpers/server/filter";

export const create = mutation({
    args: {
        name: v.string(),
        testimony: v.string(),
        status: v.string(),
        reviewDate: v.optional(v.number()),
        testifierImage: v.optional(v.id('_storage'))
    },
    handler: async (ctx, args) => {
        const { name, testimony, status, reviewDate, testifierImage } = args;
        return await ctx.db.insert("testimonials", {
            name,
            testimony,
            status,
            reviewDate,
            testifierImage
        });
    },
});

export const list = query({
    args: {
        searchQuery: v.optional(v.string()),
        statusQuery: v.optional(v.string()),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const { searchQuery, statusQuery, paginationOpts } = args;

        const results = await filter(
            ctx.db.query("testimonials"),
            (testimonial) => {
                const searchCheck = searchQuery ? testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
                const statusCheck = statusQuery ? testimonial.status === statusQuery : true;
                return searchCheck && statusCheck;
            }
        )
            .order('desc')
            .paginate(paginationOpts);

        return {
            ...results,
            page: await Promise.all(
                results.page.map(async (testimonial) => ({
                    ...testimonial,
                    ...({
                        testifierImageUrl: testimonial.testifierImage ? await ctx.storage.getUrl(testimonial.testifierImage) : ''
                    })
                }))
            ),
        }
    },
});

export const get = query({
    args: { id: v.id("testimonials") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const update = mutation({
    args: {
        id: v.id("testimonials"),
        name: v.optional(v.string()),
        testimony: v.optional(v.string()),
        status: v.optional(v.string()),
        testifierImage: v.optional(v.id('_storage'))
    },
    handler: async (ctx, args) => {

        const { id, ...updates } = args;

        return await ctx.db.patch(id, {
            ...updates,
            reviewDate: updates.status === 'rejected' || updates.status === 'approved'
                ? new Date().getTime()
                : undefined
        });
    },
});

export const remove = mutation({
    args: { id: v.id("testimonials") },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.id);
    },
}); 
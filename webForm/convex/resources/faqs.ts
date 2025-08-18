import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { filter } from "convex-helpers/server/filter";

// Create a new FAQ
export const create = mutation({
    args: {
        question: v.string(),
        answer: v.string(),
        status: v.union(v.literal("published"), v.literal("draft")),
        displayOrder: v.number(),
        category: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("faqs", {
            ...args,
        });
    },
});

// Get paginated list of FAQs with optional search and status filter
export const list = query({
    args: {
        searchQuery: v.optional(v.string()),
        statusQuery: v.optional(v.string()),
        category: v.optional(v.string()),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const { searchQuery, category, statusQuery, paginationOpts } = args;

        return await filter(
            ctx.db.query("faqs"),
            (faq) => {
                const statusCheck = statusQuery ? faq.status === statusQuery : true;
                const typeCheck = category ? faq.category === category : true;
                const searchCheck = searchQuery ?
                    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) : true;
                return statusCheck && typeCheck && searchCheck;
            }
        )
            // .withIndex('by_display_order')
            .order('desc')
            .paginate(paginationOpts);
    },
});

// Get a single FAQ by ID
export const get = query({
    args: { id: v.id("faqs") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Update an FAQ
export const update = mutation({
    args: {
        id: v.id("faqs"),
        question: v.optional(v.string()),
        answer: v.optional(v.string()),
        status: v.optional(v.union(v.literal("published"), v.literal("draft"))),
        displayOrder: v.optional(v.number()),
        category: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;

        return await ctx.db.patch(id, updates);
    },
});

// Delete an FAQ
export const remove = mutation({
    args: { id: v.id("faqs") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return null;
    },
}); 
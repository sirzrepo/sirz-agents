import { mutation, query } from '../_generated/server';
import { ConvexError, v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';
import { getPageContentById } from '../helpers';
import { filter } from 'convex-helpers/server/filter';

// Validation function for label format
const validateLabel = (label: string) => {
    const validLabelRegex = /^[a-zA-Z0-9_]+$/;
    if (!validLabelRegex.test(label)) {
        throw new ConvexError("Label can only contain letters, numbers, and underscores");
    }
    return label;
};

export const create = mutation({
    args: {
        label: v.string(),
        content: v.string(),
    },

    handler: async (ctx, args) => {
        // Validate label format
        const validatedLabel = validateLabel(args.label);

        // Check for duplicate label using the by_label index
        const existingContent = await ctx.db
            .query("pageContents")
            .withIndex("by_label", (q) => q.eq("label", validatedLabel))
            .first();

        if (existingContent) {
            throw new ConvexError("A page content with this label already exists");
        }

        const pageContentId = await ctx.db.insert('pageContents', {
            ...args,
            label: validatedLabel,
        });

        return await getPageContentById(ctx, pageContentId);
    },
});

export const list = query({
    args: {
        label: v.optional(v.string()),
        paginationOpts: paginationOptsValidator,
    },

    handler: async (ctx, args) => {
        const { label, paginationOpts } = args

        // Filter page contents by label if it is defined.
        // If label is not defined, return all page contents.
        return filter(
            ctx.db.query('pageContents'),
            (pageContent) => {
                return label
                    ? pageContent.label == label
                    : true
            }
        ).order('desc')
            .paginate(paginationOpts)
    },
});

export const getByLabel = query({
    args: {
        label: v.string(),
    },

    handler: async (ctx, args) => {
        const { label } = args

        return await ctx.db.query('pageContents')
            .withIndex('by_label', (q) => q.eq('label', label))
            .first()
    },
});

export const update = mutation({
    args: {
        id: v.id('pageContents'),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const { id, content } = args

        await ctx.db.patch(id, {
            content,
        });

        return await getPageContentById(ctx, id);
    },
});

export const remove = mutation({
    args: {
        id: v.id('pageContents'),
    },
    handler: async (ctx, args) => {
        const { id } = args

        await ctx.db.delete(id);

        return await getPageContentById(ctx, id);
    },
});
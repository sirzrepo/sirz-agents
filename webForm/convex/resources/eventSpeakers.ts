import { mutation, query } from '../_generated/server';
import { ConvexError, v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';
import { filter } from 'convex-helpers/server/filter';
import { getNotFoundErrorMessage } from '../helpers';

export const create = mutation({
    args: {
        eventId: v.id('events'),
        name: v.string(),
        description: v.optional(v.string()),
        thumbnail: v.optional(v.id('_storage')),
    },
    handler: async (ctx, args) => {
        const event = await ctx.db.get(args.eventId);
        if (!event) {
            throw new ConvexError(getNotFoundErrorMessage('Event'));
        }

        return await ctx.db.insert('eventSpeakers', args);
    },
});

export const list = query({
    args: {
        eventId: v.optional(v.id('events')),
        name: v.optional(v.string()),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const { eventId, name, paginationOpts } = args;

        const results = await filter(
            ctx.db.query('eventSpeakers'),
            (speaker) => {
                const eventCheck = eventId ? speaker.eventId === eventId : true;
                const nameCheck = name ? speaker.name === name : true;

                return eventCheck && nameCheck;
            }
        )
            .order('desc')
            .paginate(paginationOpts);

        return {
            ...results,
            page: await Promise.all(
                results.page.map(async (speaker) => ({
                    ...speaker,
                    ...({
                        thumbnailUrl: speaker.thumbnail
                            ? await ctx.storage.getUrl(speaker.thumbnail)
                            : undefined
                    })
                }))
            ),
        };
    },
});

export const get = query({
    args: {
        id: v.id('eventSpeakers'),
    },
    handler: async (ctx, args) => {
        const speaker = await ctx.db.get(args.id);
        if (!speaker) {
            throw new ConvexError(getNotFoundErrorMessage('Speaker'));
        }

        return {
            ...speaker,
            ...({
                thumbnailUrl: speaker.thumbnail
                    ? await ctx.storage.getUrl(speaker.thumbnail)
                    : undefined
            })
        };
    },
});

export const update = mutation({
    args: {
        id: v.id('eventSpeakers'),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        thumbnail: v.optional(v.id('_storage')),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;

        const speaker = await ctx.db.get(id);
        if (!speaker) {
            throw new ConvexError(getNotFoundErrorMessage('Speaker'));
        }

        await ctx.db.patch(id, updates);
        return await ctx.db.get(id);
    },
});

export const remove = mutation({
    args: {
        id: v.id('eventSpeakers'),
    },
    handler: async (ctx, args) => {
        const speaker = await ctx.db.get(args.id);
        if (!speaker) {
            throw new ConvexError(getNotFoundErrorMessage('Speaker'));
        }

        await ctx.db.delete(args.id);
        return speaker;
    },
}); 
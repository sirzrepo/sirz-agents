import { mutation, query } from '../_generated/server';
import { ConvexError, v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';
import { filter } from 'convex-helpers/server/filter';
import { UpdateEventData } from '../global';
import { getAuthUserId } from '@convex-dev/auth/server';
import { getAuthenticationErrorMessage, getImageUrl, getNotFoundErrorMessage } from '../helpers';
import { Doc } from '../_generated/dataModel';

export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        dateTime: v.number(),
        venue: v.string(),
        venueType: v.string(),
        eventType: v.string(),
        thumbnail: v.optional(v.id('_storage')),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError(getAuthenticationErrorMessage());
        }

        return await ctx.db.insert('events', {
            ...args,
            createdBy: userId,
        });
    },
});

export const list = query({
    args: {
        paginationOpts: paginationOptsValidator,
        title: v.optional(v.string()),
        venue: v.optional(v.string()),
        venueType: v.optional(v.string()),
        eventType: v.optional(v.string()),
        createdBy: v.optional(v.id('users')),
        searchQuery: v.optional(v.string()),
        dateQuery: v.optional(v.number())
    },
    handler: async (ctx, args) => {
        const { paginationOpts, title, venue, venueType, eventType, createdBy, searchQuery, dateQuery } = args;

        const query = ctx.db.query('events');

        const dateQueryDay = dateQuery ? new Date(dateQuery).getDate() : null
        const dateQueryMonth = dateQuery ? new Date(dateQuery).getMonth() : null
        const dateQueryYear = dateQuery ? new Date(dateQuery).getFullYear() : null

        const results = await filter(
            query,
            (event) => {
                const eventDay = event.dateTime ? new Date(event.dateTime).getDate() : null
                const eventMonth = event.dateTime ? new Date(event.dateTime).getMonth() : null
                const eventYear = event.dateTime ? new Date(event.dateTime).getFullYear() : null


                const titleCheck = title ? event.title === title : true;
                const venueCheck = venue ? event.venue === venue : true;
                const venueTypeCheck = venueType ? event.venueType === venueType : true;
                const eventTypeCheck = eventType ? event.eventType === eventType : true;
                const createdByCheck = createdBy ? event.createdBy === createdBy : true;
                const searchQueryCheck = searchQuery ? event.title.includes(searchQuery) : true;
                const dateQueryCheck = dateQuery
                    ? (eventDay === dateQueryDay && eventMonth === dateQueryMonth && eventYear === dateQueryYear)
                    : true

                return titleCheck && venueCheck && venueTypeCheck && eventTypeCheck && createdByCheck && searchQueryCheck && dateQueryCheck;
            }
        )
            .order('desc')
            .paginate(paginationOpts);

        // Add image URLs to products
        const items = await Promise.all(
            results.page.map(async (event: Doc<"events">) => {
                return {
                    ...event,
                    thumbnailUrl: event.thumbnail ? await getImageUrl(ctx, event.thumbnail) : undefined
                }
            }
            )
        ).then(items => items.filter(item => item !== null));

        return {
            ...results,
            page: items
        };
    },
});

export const get = query({
    args: {
        id: v.id('events'),
    },
    handler: async (ctx, args) => {
        const event = await ctx.db.get(args.id);

        if (!event) {
            throw new ConvexError(getNotFoundErrorMessage('event'));
        }

        return {
            ...event,
            thumbnailUrl: event.thumbnail ? await getImageUrl(ctx, event.thumbnail) : undefined
        }
    },
});

export const update = mutation({
    args: {
        id: v.id('events'),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        dateTime: v.optional(v.number()),
        venue: v.optional(v.string()),
        venueType: v.optional(v.string()),
        eventType: v.optional(v.string()),
        thumbnail: v.optional(v.id('_storage')),
        createdBy: v.optional(v.id('users')),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;

        // Remove undefined values
        const cleanUpdates: UpdateEventData = {};

        Object.keys(updates).forEach((key) => {
            const typedKey = key as keyof UpdateEventData;
            if (updates[typedKey] !== undefined) {
                cleanUpdates[typedKey] = updates[typedKey];
            }
        });

        await ctx.db.patch(id, cleanUpdates);
        return await ctx.db.get(id);
    },
});

export const remove = mutation({
    args: {
        id: v.id('events'),
    },
    handler: async (ctx, args) => {
        const event = await ctx.db.get(args.id);
        await ctx.db.delete(args.id);
        return event;
    },
}); 
import { mutation, query } from '../_generated/server';
import { ConvexError, v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';
import { filter } from 'convex-helpers/server/filter';
import { getNotFoundErrorMessage } from '../helpers';

export const create = mutation({
    args: {
        eventId: v.id('events'),
        name: v.string(),
        email: v.string(),
        phone: v.string(),
        checkedIn: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const event = await ctx.db.get(args.eventId);
        if (!event) {
            throw new ConvexError(getNotFoundErrorMessage('Event'));
        }

        return await ctx.db.insert('eventAttendees', {
            ...args,
            checkedIn: args.checkedIn ?? false,
        });
    },
});

export const list = query({
    args: {
        eventId: v.optional(v.id('events')),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        checkedIn: v.optional(v.boolean()),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const { eventId, name, email, phone, checkedIn, paginationOpts } = args;

        return await filter(
            ctx.db.query('eventAttendees'),
            (attendee) => {
                const eventCheck = eventId ? attendee.eventId === eventId : true;
                const nameCheck = name ? attendee.name === name : true;
                const emailCheck = email ? attendee.email === email : true;
                const phoneCheck = phone ? attendee.phone === phone : true;
                const checkedInCheck = checkedIn !== undefined ? attendee.checkedIn === checkedIn : true;

                return eventCheck && nameCheck && emailCheck && phoneCheck && checkedInCheck;
            }
        )
            .order('desc')
            .paginate(paginationOpts);
    },
});

export const get = query({
    args: {
        id: v.id('eventAttendees'),
    },
    handler: async (ctx, args) => {
        const attendee = await ctx.db.get(args.id);
        if (!attendee) {
            throw new ConvexError(getNotFoundErrorMessage('Attendee'));
        }
        return attendee;
    },
});

export const update = mutation({
    args: {
        id: v.id('eventAttendees'),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        checkedIn: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;

        const attendee = await ctx.db.get(id);
        if (!attendee) {
            throw new ConvexError(getNotFoundErrorMessage('Attendee'));
        }

        await ctx.db.patch(id, updates);
        return await ctx.db.get(id);
    },
});

export const remove = mutation({
    args: {
        id: v.id('eventAttendees'),
    },
    handler: async (ctx, args) => {
        const attendee = await ctx.db.get(args.id);
        if (!attendee) {
            throw new ConvexError(getNotFoundErrorMessage('Attendee'));
        }

        await ctx.db.delete(args.id);
        return null;
    },
}); 
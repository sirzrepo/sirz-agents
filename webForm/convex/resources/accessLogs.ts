import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { filter } from "convex-helpers/server/filter";

export const logAccess = mutation({
    args: {
        path: v.string(),
        method: v.string(),
        timestamp: v.number(),
        userId: v.optional(v.id('users')),
        userAgent: v.optional(v.string()),
        ipAddress: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("accessLogs", args);
    },
});

// Get a paginated access logs list.
// Add filtering options for path, method, userId, userAgent, and ipAddress.
export const list = query({
    args: {
        path: v.optional(v.string()),
        method: v.optional(v.string()),
        userId: v.optional(v.id('users')),
        userAgent: v.optional(v.string()),
        ipAddress: v.optional(v.string()),
        paginationOpts: paginationOptsValidator
    },
    handler: async (ctx, args) => {
        const { userId, paginationOpts } = args

        const query = ctx.db.query('accessLogs')

        // Filter access logs by userId if it is defined.
        // If userId is not defined, return all access logs.
        // Filter access logs by path, method, userAgent, and ipAddress if they are defined.
        // If path, method, userAgent, or ipAddress are not defined, return all access logs.
        // Order access logs by timestamp in descending order.
        // Paginate access logs using the provided pagination options.
        // Return the paginated access logs.
        const accessLogs = await filter(
            query,
            (accessLog) => {
                const checkUserId = userId
                    ? accessLog.userId === userId
                    : true
                const checkPath = args.path
                    ? accessLog.path === args.path
                    : true
                const checkMethod = args.method
                    ? accessLog.method === args.method
                    : true
                const checkUserAgent = args.userAgent
                    ? accessLog.userAgent === args.userAgent
                    : true
                const checkIpAddress = args.ipAddress
                    ? accessLog.ipAddress === args.ipAddress
                    : true

                return checkUserId && checkPath && checkMethod && checkUserAgent && checkIpAddress
            }
        )
            .order('desc')
            .paginate(paginationOpts)

        return accessLogs
    },
});

// Get a single access log by id.
export const get = query({
    args: {
        id: v.id('accessLogs')
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Delete an access log by id.
export const remove = mutation({
    args: {
        id: v.id('accessLogs')
    },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.id);
    },
});
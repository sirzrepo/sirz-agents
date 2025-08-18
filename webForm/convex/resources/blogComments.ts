import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { filter } from "convex-helpers/server/filter";
import { paginationOptsValidator } from "convex/server";

export const create = mutation({
    args: {
        blogId: v.id('blogs'),
        authorName: v.string(),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const blogCommentId = await ctx.db.insert('blogComments', {
            blogId: args.blogId,
            authorName: args.authorName,
            content: args.content,
        });

        return await ctx.db.get(blogCommentId);
    },
});

export const list = query({
    args: {
        blogId: v.optional(v.id('blogs')),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const { blogId, paginationOpts } = args;

        const comments = await filter(
            ctx.db.query('blogComments'),
            (comment) => {
                return blogId ? comment.blogId === blogId : true;
            }
        ).order('desc')
            .paginate(paginationOpts);

        return comments;
    },
});

export const remove = mutation({
    args: {
        id: v.id('blogComments'),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return true;
    },
});

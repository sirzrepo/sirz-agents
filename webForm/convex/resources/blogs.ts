import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { getAuthenticatedUser, getAuthenticationErrorMessage, getAuthorizationErrorMessage, getBlogById, getBlogBySlug, getNotFoundErrorMessage, makeSlug } from "../helpers";
import { filter } from "convex-helpers/server/filter";
import { paginationOptsValidator } from "convex/server";



export const create = mutation({
    args: {
        title: v.string(),
        content: v.string(),
        summary: v.string(),
        status: v.union(v.literal("draft"), v.literal("published"), v.literal("archived")),
        featuredImage: v.optional(v.id("_storage")),
        tags: v.optional(v.string()),
        category: v.optional(v.string()),
        metaDescription: v.optional(v.string()),
        readingTime: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const user = await getAuthenticatedUser(ctx);

        // TODO: Work on this while implementing user roles
        // const identity = await ctx.auth.getUserIdentity();
        // if (!identity) throw new Error("Authentication required");

        if (!user) throw new ConvexError(getAuthenticationErrorMessage());

        const blogId = await ctx.db.insert("blogs", {
            ...args,
            author: user._id,
            publishedAt: args.status === "published" ? Date.now() : undefined,
            views: 0,
            slug: makeSlug(args.title),
        });

        return await getBlogById(ctx, blogId);
    },
});

export const list = query({
    args: {
        searchQuery: v.optional(v.string()),
        status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))),
        tag: v.optional(v.string()),
        author: v.optional(v.id("users")),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const { searchQuery, status, tag, author } = args;
        let query = ctx.db.query("blogs");

        query = filter(
            query,
            (blog) => {
                const searchQueryCheck = searchQuery ? blog.title.includes(searchQuery) : true;
                const statusCheck = status ? blog.status === status : true;
                const tagCheck = tag ? blog.tags?.includes(tag) === true : true;
                const authorCheck = author ? blog.author === author : true;

                return searchQueryCheck && statusCheck && tagCheck && authorCheck;
            }
        );

        const results = await query
            .order("desc")
            .paginate(args.paginationOpts);

        return {
            ...results,
            page: await Promise.all(
                results.page.map(async (blog) => ({
                    ...blog,
                    ...({
                        featuredImageUrl: blog.featuredImage
                            ? await ctx.storage.getUrl(blog.featuredImage)
                            : '',
                        authorData: await ctx.db.get(blog.author)
                    })
                }))
            ),
        }
    },
});

export const get = query({
    args: { id: v.id('blogs') },
    handler: async (ctx, args) => {
        const blog = await getBlogById(ctx, args.id);

        return {
            ...blog,
            authorData: await ctx.db.get(blog.author)
        }
    },
});

export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await getBlogBySlug(ctx, args.slug);
    },
});

export const update = mutation({
    args: {
        id: v.id("blogs"),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        summary: v.optional(v.string()),
        status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("archived"))),
        featuredImage: v.optional(v.id("_storage")),
        tags: v.optional(v.string()),
        metaDescription: v.optional(v.string()),
        readingTime: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;

        // TODO: Use authentication middleware while implementing user roles
        const user = await getAuthenticatedUser(ctx);

        if (!user) throw new ConvexError(getAuthenticationErrorMessage());

        const blog = await ctx.db.get(id);
        if (!blog) throw new ConvexError(getNotFoundErrorMessage("Blog"));

        // Only allow updates by the author
        if (blog.author !== user._id) throw new ConvexError(getAuthorizationErrorMessage());

        await ctx.db.patch(id, {
            ...updates,
            publishedAt: updates.status === "published" ? Date.now() : undefined,
            slug: updates.title ? makeSlug(updates.title) : blog.slug,
        });

        return await getBlogById(ctx, id);
    },
});

export const remove = mutation({
    args: {
        id: v.id("blogs"),
    },
    handler: async (ctx, args) => {
        const { id } = args;
        const user = await getAuthenticatedUser(ctx);


        const blog = await ctx.db.get(id);
        if (!blog) throw new ConvexError(getNotFoundErrorMessage("Blog"));

        // const user = await ctx.db
        //     .query("users")
        //     .filter(q => q.eq(q.field("email"), identity.email))
        //     .first();
        if (!user) throw new ConvexError(getAuthenticationErrorMessage());

        // Only allow deletion by the author
        if (blog.author !== user._id) throw new ConvexError(getAuthorizationErrorMessage());

        await ctx.db.delete(id);
    },
});

export const incrementViews = mutation({
    args: { id: v.id("blogs") },
    handler: async (ctx, args) => {
        const { id } = args;
        const blog = await ctx.db.get(id);
        if (!blog) throw new ConvexError(getNotFoundErrorMessage("Blog"));

        await ctx.db.patch(id, { views: blog.views + 1 });

        return await getBlogById(ctx, id);
    },
});
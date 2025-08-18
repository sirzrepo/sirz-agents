import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { getAuthenticatedUser, getAuthenticationErrorMessage, getNotFoundErrorMessage } from "../helpers";
import { paginationOptsValidator } from "convex/server";
import { filter } from "convex-helpers/server/filter";
import { Id } from "../_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const upload = mutation({
    args: {
        fileName: v.optional(v.string()),
        storageId: v.optional(v.id("_storage")),
        mediaType: v.union(v.literal('image'), v.literal('audio'), v.literal('video'), v.literal('youtube')),
        youtubeUrl: v.optional(v.string()),
        category: v.optional(v.string()),
        metadata: v.optional(v.object({
            width: v.optional(v.number()),
            height: v.optional(v.number()),
            duration: v.optional(v.number()),
            description: v.optional(v.string())
        }))
    },
    handler: async (ctx, args) => {
        // TODO: Work on this while implementing user roles
        // TODO: Add authorization rules
        const user = await getAuthenticatedUser(ctx);
        if (!user) {
            throw new ConvexError(getAuthenticationErrorMessage());
        }

        let mediaId: Id<"media">;

        if (args.mediaType === 'youtube') {
            const youtubeUrl = args.youtubeUrl;
            if (!youtubeUrl) {
                throw new ConvexError("YouTube URL is required for YouTube videos");
            }

            mediaId = await ctx.db.insert("media", {
                ...args,
                uploadedBy: user._id,
            });
        } else {
            const storageId = args.storageId;
            if (!storageId) {
                throw new ConvexError("Storage ID is required for other media types");
            }

            const fileData = await ctx.db.system.get(storageId);
            if (!fileData) {
                throw new ConvexError(getNotFoundErrorMessage("file data"));
            }

            mediaId = await ctx.db.insert("media", {
                ...args,
                uploadedBy: user._id,
                storageId: storageId,
                fileSize: fileData.size,
                fileType: fileData.contentType,
            });
        }

        return await ctx.db.get(mediaId);
    },
});

export const list = query({
    args: {
        mediaType: v.optional(v.union(v.literal('image'), v.literal('audio'), v.literal('video'))),
        paginationOpts: paginationOptsValidator
    },
    handler: async (ctx, args) => {
        const { mediaType, paginationOpts } = args;

        const results = await filter(
            ctx.db.query("media"),
            (media) => mediaType ? media.mediaType === mediaType : true
        )
            .order("desc")
            .paginate(paginationOpts);

        return {
            ...results,
            page: await Promise.all(
                results.page.map(async (media) => ({
                    ...media,
                    ...({
                        url: media.storageId ? await ctx.storage.getUrl(media.storageId) : ''
                    })
                }))
            ),
        }
    },
});

export const listAll = query({
    args: {
    },
    handler: async (ctx) => {
        // const { mediaType, paginationOpts } = args;

        const results = await ctx.db.query("media")
            .order("desc")
            .collect();

        return await Promise.all(
            results.map(async (media) => ({
                ...media,
                ...({
                    url: media.storageId ? await ctx.storage.getUrl(media.storageId) : ''
                })
            }))
        )
    },
});


export const get = query({
    args: {
        id: v.id("media")
    },
    handler: async (ctx, args) => {
        const { id } = args;

        const media = await ctx.db.get(id);

        if (!media) {
            throw new ConvexError(getNotFoundErrorMessage("media"));
        }

        return {
            ...media,
            ...({
                url: media.storageId ? await ctx.storage.getUrl(media.storageId) : ''
            })
        };
    },
});

export const remove = mutation({
    args: {
        id: v.id("media")
    },
    handler: async (ctx, args) => {
        const user = await getAuthenticatedUser(ctx);

        if (!user) {
            throw new ConvexError(getAuthenticationErrorMessage());
        }

        const media = await ctx.db.get(args.id);
        if (!media) {
            throw new ConvexError(getNotFoundErrorMessage("media"));
        }

        // TODO: Work on this while implementing user roles
        // Only allow the original uploader or admin to delete
        // const user = await ctx.db
        //   .query("users")
        //   .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
        //   .first();

        // if (media.uploadedBy !== user._id && !user.isAdmin) {
        //   throw new ConvexError("Unauthorized");
        // }

        await ctx.db.delete(args.id);
        return true;
    },
});

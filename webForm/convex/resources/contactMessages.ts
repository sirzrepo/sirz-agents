// api/convex/resources/contactMessages.ts
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";


// Create a new contact message
export const create = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.string(),
        subject: v.string(),
        message: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("contactMessages", args);
    }
});

// Read a contact message by ID
export const get = query({
    args: {
        id: v.id('contactMessages')
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    }
});

// Update a contact message by ID
export const update = mutation({
    args: {
        id: v.id('contactMessages'),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        subject: v.optional(v.string()),
        message: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args
        return await ctx.db.patch(id, updates);
    }
});

// Delete a contact message by ID
export const remove = mutation({
    args: {
        id: v.id('contactMessages')
    },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.id);
    }
});
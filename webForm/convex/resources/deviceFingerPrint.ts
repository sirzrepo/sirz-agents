import { query, mutation } from "../_generated/server";
import { v } from "convex/values";
import type { Id } from "../_generated/dataModel";

// Type for the device fingerprint document
type DeviceFingerprint = {
  _id: Id<"deviceFingerPrint">;
  _creationTime: number;
  userId: Id<"users">;
  fingerprint: string;
};

/**
 * Create or update a device fingerprint for a user
 */
export const upsertDeviceFingerprint = mutation({
  args: {
    userId: v.id("users"),
    fingerprint: v.string(),
  },
  handler: async (ctx, args): Promise<DeviceFingerprint> => {
    const { userId, fingerprint } = args;
    const now = Date.now();
    
    // Check if fingerprint already exists for this user
    const existing = await ctx.db
      .query("deviceFingerPrint")
      .withIndex("by_user", (q: any) => q.eq("userId", userId))
      .first();

    if (existing) {
      // Update existing fingerprint
      await ctx.db.patch(existing._id, {
        fingerprint,
      });
      return { ...existing, fingerprint } as DeviceFingerprint;
    } else {
      // Create new fingerprint
      const id = await ctx.db.insert("deviceFingerPrint", {
        userId,
        fingerprint,
      });
      return {
        _id: id,
        _creationTime: now,
        userId,
        fingerprint,
      };
    }
  },
});

/**
 * Get device fingerprint by user ID
 */
export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args): Promise<DeviceFingerprint | null> => {
    return await ctx.db
      .query("deviceFingerPrint")
      .withIndex("by_user", (q: any) => q.eq("userId", args.userId))
      .first();
  },
});

/**
 * Get device fingerprint by user ID and fingerprint string
 */
export const getByUserIdAndFingerprint = query({
  args: {
    userId: v.id("users"),
    fingerprint: v.string(),
  },
  handler: async (ctx, args): Promise<DeviceFingerprint | null> => {
    const all = await ctx.db
      .query("deviceFingerPrint")
      .withIndex("by_user", (q: any) => q.eq("userId", args.userId))
      .collect();
    return all.find((doc: DeviceFingerprint) => doc.fingerprint === args.fingerprint) || null;
  },
});

/**
 * Get device fingerprint by fingerprint string
 */
export const getByFingerprint = query({
  args: { fingerprint: v.string() },
  handler: async (ctx, args): Promise<DeviceFingerprint | null> => {
    return await ctx.db
      .query("deviceFingerPrint")
      .withIndex("by_fingerprint", (q: any) => q.eq("fingerprint", args.fingerprint))
      .first();
  },
});

/**
 * Delete a device fingerprint by user ID
 */
export const deleteByUserId = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args): Promise<{ success: boolean; message?: string }> => {
    const fingerprint = await ctx.db
      .query("deviceFingerPrint")
      .withIndex("by_user", (q: any) => q.eq("userId", args.userId))
      .first();
    
    if (fingerprint) {
      await ctx.db.delete(fingerprint._id);
      return { success: true };
    }
    return { success: false, message: "Fingerprint not found" };
  },
});

/**
 * List all device fingerprints
 * Note: Use with caution as this could return a large number of records
 */
export const listAll = query({
  args: {},
  handler: async (ctx): Promise<DeviceFingerprint[]> => {
    return await ctx.db.query("deviceFingerPrint").collect();
  },
});
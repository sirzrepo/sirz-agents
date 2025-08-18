import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";

// List daily inventory records with pagination and filtering
export const list = query({
    args: {
        branchId: v.optional(v.id("branch")),
        productId: v.optional(v.id("products")),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
        paginationOpts: paginationOptsValidator
    },
    handler: async (ctx, args) => {
        const { branchId, productId, startDate, endDate, paginationOpts } = args;

        // Start with a base query
        let query = ctx.db.query("dailyInventory");
        
        // Apply filters
        if (branchId) {
            query = query.filter(q => q.eq(q.field("branchId"), branchId));
        }
        
        if (productId) {
            query = query.filter(q => q.eq(q.field("productId"), productId));
        }
        
        if (startDate && endDate) {
            query = query.filter(q => 
                q.and(
                    q.gte(q.field("date"), startDate),
                    q.lte(q.field("date"), endDate)
                )
            );
        }
        
        return await query.paginate(paginationOpts);
    },
});

// Get daily inventory record by ID
export const get = query({
    args: {
        id: v.id("dailyInventory"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create or update a daily inventory record
export const recordDailyInventory = mutation({
    args: {
        productId: v.id("products"),
        branchId: v.id("branch"),
        date: v.string(), // ISO date string (YYYY-MM-DD)
        initialStock: v.number(),
        addedStock: v.number(),
        removedStock: v.number(),
        quantitySold: v.number(),
        salesAmount: v.number(),
        closingStock: v.number(),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { 
            productId, branchId, date, initialStock, addedStock, 
            removedStock, quantitySold, salesAmount, closingStock, notes 
        } = args;

        // Check if product exists
        const product = await ctx.db.get(productId);
        if (!product) {
            throw new ConvexError("Product not found");
        }

        // Check if branch exists
        const branch = await ctx.db.get(branchId);
        if (!branch) {
            throw new ConvexError("Branch not found");
        }

        // Check if we already have a record for this product, branch, and date
        const existingRecord = await ctx.db
            .query("dailyInventory")
            .filter(q => 
                q.and(
                    q.eq(q.field("productId"), productId),
                    q.eq(q.field("branchId"), branchId),
                    q.eq(q.field("date"), date)
                )
            )
            .first();

        const now = new Date().toISOString();

        // Create or update the daily inventory record
        if (existingRecord) {
            return await ctx.db.patch(existingRecord._id, {
                initialStock,
                addedStock,
                removedStock,
                quantitySold,
                salesAmount,
                closingStock,
                notes,
                updatedAt: now,
            });
        } else {
            return await ctx.db.insert("dailyInventory", {
                productId,
                branchId,
                date,
                initialStock,
                addedStock,
                removedStock,
                quantitySold,
                salesAmount,
                closingStock,
                notes,
                createdAt: now,
                updatedAt: now,
            });
        }
    },
});

// Initialize today's inventory records for all products at a branch
export const initializeTodayRecords = mutation({
    args: {
        branchId: v.id("branch"),
    },
    handler: async (ctx, args) => {
        const { branchId } = args;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        // Check if branch exists
        const branch = await ctx.db.get(branchId);
        if (!branch) {
            throw new ConvexError("Branch not found");
        }
        
        // Get all products at this branch
        const inventoryItems = await ctx.db
            .query("productInventory")
            .filter(q => q.eq(q.field("branchId"), branchId))
            .collect();
            
        const results = [];
        const errors = [];
        
        for (const inventory of inventoryItems) {
            try {
                // Check if we already have a record for today
                const existingRecord = await ctx.db
                    .query("dailyInventory")
                    .filter(q => 
                        q.and(
                            q.eq(q.field("productId"), inventory.productId),
                            q.eq(q.field("branchId"), branchId),
                            q.eq(q.field("date"), today)
                        )
                    )
                    .first();
                    
                // Skip if we already have a record for today
                if (existingRecord) {
                    continue;
                }
                
                // Create today's record with initial values
                const now = new Date().toISOString();
                const record = await ctx.db.insert("dailyInventory", {
                    productId: inventory.productId,
                    branchId,
                    date: today,
                    initialStock: inventory.stock,
                    addedStock: 0,
                    removedStock: 0,
                    quantitySold: 0,
                    salesAmount: 0,
                    closingStock: inventory.stock, // Initially, closing stock equals initial stock
                    createdAt: now,
                    updatedAt: now,
                });
                
                results.push({
                    productId: inventory.productId,
                    recordId: record,
                    success: true
                });
            } catch (error) {
                errors.push({
                    productId: inventory.productId,
                    error: error instanceof Error ? error.message : "Unknown error",
                    success: false
                });
            }
        }
        
        return {
            success: errors.length === 0,
            results,
            errors
        };
    },
});

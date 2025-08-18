import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { filter } from "convex-helpers/server/filter";

// Create a product inventory entry for a branch
export const create = mutation({
    args: {
        productId: v.id("products"),
        branchId: v.id("branch"),
        departmentId: v.optional(v.id("departments")), // Optional department association
        stock: v.number(),
        isAvailableAtBranch: v.optional(v.boolean()),
        price: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        // Check if product exists
        const product = await ctx.db.get(args.productId);
        if (!product) {
            throw new ConvexError("Product not found");
        }

        // Check if branch exists
        const branch = await ctx.db.get(args.branchId);
        if (!branch) {
            throw new ConvexError("Branch not found");
        }

        // Check if inventory entry already exists for this product and branch
        const existingInventory = await ctx.db
            .query("productInventory")
            .withIndex("by_product_and_branch", (q) => 
                q.eq("productId", args.productId).eq("branchId", args.branchId)
            )
            .first();

        if (existingInventory) {
            throw new ConvexError("Product inventory already exists for this branch");
        }

        return await ctx.db.insert("productInventory", {
            productId: args.productId,
            branchId: args.branchId,
            departmentId: args.departmentId, // Include department ID if provided
            stock: args.stock,
            isAvailableAtBranch: args.isAvailableAtBranch ?? true,
            price: args.price,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    },
});

// List product inventory with pagination and filtering
export const list = query({
    args: {
        branchId: v.optional(v.id("branch")),
        productId: v.optional(v.id("products")),
        isAvailableAtBranch: v.optional(v.boolean()),
        paginationOpts: paginationOptsValidator
    },
    handler: async (ctx, args) => {
        const { branchId, productId, isAvailableAtBranch, paginationOpts } = args;

        // Start with a base query
        let baseQuery = ctx.db.query("productInventory");
        
        // Apply filters using the filter helper
        return await filter(
            baseQuery,
            (inventory) => {
                // Filter by branch
                if (branchId && inventory.branchId !== branchId) {
                    return false;
                }
                
                // Filter by product
                if (productId && inventory.productId !== productId) {
                    return false;
                }
                
                // Filter by availability
                if (isAvailableAtBranch !== undefined && inventory.isAvailableAtBranch !== isAvailableAtBranch) {
                    return false;
                }
                
                return true;
            },
        ).paginate(paginationOpts);
    },
});

// List all product inventory without pagination
export const listAll = query({
    args: {
        branchId: v.optional(v.id("branch")),
        productId: v.optional(v.id("products")),
        isAvailableAtBranch: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { branchId, productId, isAvailableAtBranch } = args;

        // Start with a base query
        let baseQuery = ctx.db.query("productInventory");
        
        // Apply filters using the filter helper
        return await filter(
            baseQuery,
            (inventory) => {
                // Filter by branch
                if (branchId && inventory.branchId !== branchId) {
                    return false;
                }
                
                // Filter by product
                if (productId && inventory.productId !== productId) {
                    return false;
                }
                
                // Filter by availability
                if (isAvailableAtBranch !== undefined && inventory.isAvailableAtBranch !== isAvailableAtBranch) {
                    return false;
                }
                
                return true;
            },
        ).collect();
    },
});

// Get product inventory by ID
export const get = query({
    args: {
        id: v.id("productInventory"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get product inventory by product and branch
export const getByProductAndBranch = query({
    args: {
        productId: v.id("products"),
        branchId: v.id("branch"),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("productInventory")
            .withIndex("by_product_and_branch", (q) => 
                q.eq("productId", args.productId).eq("branchId", args.branchId)
            )
            .first();
    },
});

// Update product inventory
export const update = mutation({
    args: {
        id: v.id("productInventory"),
        stock: v.optional(v.number()),
        isAvailableAtBranch: v.optional(v.boolean()),
        price: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        if (Object.keys(updates).length === 0) return new ConvexError("No updates provided");

        return await ctx.db.patch(id, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Update stock for a product at a specific branch
export const updateStock = mutation({
    args: {
        productId: v.id("products"),
        branchId: v.id("branch"),
        stock: v.number(),
    },
    handler: async (ctx, args) => {
        const { productId, branchId, stock } = args;

        // Find the inventory entry
        const inventory = await ctx.db
            .query("productInventory")
            .withIndex("by_product_and_branch", (q) => 
                q.eq("productId", productId).eq("branchId", branchId)
            )
            .first();

        if (!inventory) {
            throw new ConvexError("Product inventory not found for this branch");
        }

        // Update the stock
        return await ctx.db.patch(inventory._id, {
            stock,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Toggle product availability at a branch
export const toggleAvailability = mutation({
    args: {
        productId: v.id("products"),
        branchId: v.id("branch"),
    },
    handler: async (ctx, args) => {
        const { productId, branchId } = args;

        // Find the inventory entry
        const inventory = await ctx.db
            .query("productInventory")
            .withIndex("by_product_and_branch", (q) => 
                q.eq("productId", productId).eq("branchId", branchId)
            )
            .first();

        if (!inventory) {
            throw new ConvexError("Product inventory not found for this branch");
        }

        // Toggle availability
        return await ctx.db.patch(inventory._id, {
            isAvailableAtBranch: !inventory.isAvailableAtBranch,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Delete product inventory
export const deleteInventory = mutation({
    args: {
        id: v.id("productInventory"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.id);
    },
}); 

// Reduce stock for multiple products after a successful order
export const reduceStockAfterOrder = mutation({
    args: {
        items: v.array(
            v.object({
                productId: v.id("products"),
                quantity: v.number(),
            })
        ),
        branchId: v.optional(v.id("branch")),
    },
    handler: async (ctx, args) => {
        const { items, branchId } = args;
        const results = [];
        const errors = [];

        // Process each item in the order
        for (const item of items) {
            try {
                // If no branchId is provided (e.g., for home delivery), 
                // we'll need to decide which branch's inventory to reduce
                // For now, we'll require a branchId
                if (!branchId) {
                    throw new ConvexError("Branch ID is required to update inventory");
                }

                // Find the inventory entry for this product at this branch
                const inventory = await ctx.db
                    .query("productInventory")
                    .withIndex("by_product_and_branch", (q) => 
                        q.eq("productId", item.productId).eq("branchId", branchId)
                    )
                    .first();

                if (!inventory) {
                    throw new ConvexError(`Product inventory not found for product ${item.productId} at this branch`);
                }

                // Calculate new stock level
                const newStock = Math.max(0, inventory.stock - item.quantity);
                
                // Update the stock
                await ctx.db.patch(inventory._id, {
                    stock: newStock,
                    updatedAt: new Date().toISOString(),
                });
                
                results.push({
                    productId: item.productId,
                    oldStock: inventory.stock,
                    newStock,
                    success: true
                });
            } catch (error) {
                errors.push({
                    productId: item.productId,
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
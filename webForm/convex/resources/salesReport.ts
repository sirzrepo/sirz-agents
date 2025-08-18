import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { filter } from "convex-helpers/server/filter";

// Create a sales report entry
export const create = mutation({
    args: {
        productId: v.id("products"),
        branchId: v.id("branch"),
        startDate: v.string(), // ISO date string
        endDate: v.string(), // ISO date string
        openingStock: v.number(),
        addedStock: v.number(),
        removedStock: v.number(),
        productPrice: v.number(),
        quantitySold: v.number(),
        salesAmount: v.number(),
        closingStock: v.number(),
        notes: v.optional(v.string()),
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

        // Validate dates
        const startDate = new Date(args.startDate);
        const endDate = new Date(args.endDate);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new ConvexError("Invalid date format");
        }
        
        if (startDate > endDate) {
            throw new ConvexError("Start date must be before end date");
        }

        // Validate stock calculations
        const calculatedClosingStock = args.openingStock + args.addedStock - args.removedStock - args.quantitySold;
        if (calculatedClosingStock !== args.closingStock) {
            throw new ConvexError("Closing stock calculation mismatch");
        }

        // Validate sales amount
        const calculatedSalesAmount = args.quantitySold * args.productPrice;
        if (calculatedSalesAmount !== args.salesAmount) {
            throw new ConvexError("Sales amount calculation mismatch");
        }

        return await ctx.db.insert("salesReport", {
            productId: args.productId,
            branchId: args.branchId,
            startDate: args.startDate,
            endDate: args.endDate,
            openingStock: args.openingStock,
            addedStock: args.addedStock,
            removedStock: args.removedStock,
            productPrice: args.productPrice,
            quantitySold: args.quantitySold,
            salesAmount: args.salesAmount,
            closingStock: args.closingStock,
            notes: args.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    },
});

// List sales reports with pagination and filtering
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
        let baseQuery = ctx.db.query("salesReport");
        
        // Apply filters using the filter helper
        return await filter(
            baseQuery,
            (report) => {
                // Filter by branch
                if (branchId && report.branchId !== branchId) {
                    return false;
                }
                
                // Filter by product
                if (productId && report.productId !== productId) {
                    return false;
                }
                
                // Filter by date range
                if (startDate && endDate) {
                    const reportStartDate = new Date(report.startDate);
                    const reportEndDate = new Date(report.endDate);
                    const filterStartDate = new Date(startDate);
                    const filterEndDate = new Date(endDate);
                    
                    // Check if there's any overlap between the report period and filter period
                    // A report should be included if:
                    // - The report's end date is on or after the filter's start date AND
                    // - The report's start date is on or before the filter's end date
                    if (reportEndDate < filterStartDate || reportStartDate > filterEndDate) {
                        return false;
                    }
                }
                
                return true;
            },
        ).paginate(paginationOpts);
    },
});

// List all sales reports without pagination
export const listAll = query({
    args: {
        branchId: v.optional(v.id("branch")),
        productId: v.optional(v.id("products")),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { branchId, productId, startDate, endDate } = args;

        // Start with a base query
        let baseQuery = ctx.db.query("salesReport");
        
        // Apply filters using the filter helper
        return await filter(
            baseQuery,
            (report) => {
                // Filter by branch
                if (branchId && report.branchId !== branchId) {
                    return false;
                }
                
                // Filter by product
                if (productId && report.productId !== productId) {
                    return false;
                }
                
                // Filter by date range
                if (startDate && endDate) {
                    const reportStartDate = new Date(report.startDate);
                    const reportEndDate = new Date(report.endDate);
                    const filterStartDate = new Date(startDate);
                    const filterEndDate = new Date(endDate);
                    
                    // Check if there's any overlap between the report period and filter period
                    if (reportEndDate < filterStartDate || reportStartDate > filterEndDate) {
                        return false;
                    }
                }
                
                return true;
            },
        ).collect();
    },
});

// Get sales report by ID
export const get = query({
    args: {
        id: v.id("salesReport"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get sales report by product and branch for a specific date range
export const getByProductAndBranch = query({
    args: {
        productId: v.id("products"),
        branchId: v.id("branch"),
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const { productId, branchId, startDate, endDate } = args;
        
        // Find reports that match the criteria
        const reports = await ctx.db
            .query("salesReport")
            .filter((q) => 
                q.and(
                    q.eq(q.field("productId"), productId),
                    q.eq(q.field("branchId"), branchId),
                    q.eq(q.field("startDate"), startDate),
                    q.eq(q.field("endDate"), endDate)
                )
            )
            .collect();
            
        return reports.length > 0 ? reports[0] : null;
    },
});

// Update sales report
export const update = mutation({
    args: {
        id: v.id("salesReport"),
        openingStock: v.optional(v.number()),
        addedStock: v.optional(v.number()),
        removedStock: v.optional(v.number()),
        productPrice: v.optional(v.number()),
        quantitySold: v.optional(v.number()),
        salesAmount: v.optional(v.number()),
        closingStock: v.optional(v.number()),
        notes: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        if (Object.keys(updates).length === 0) return new ConvexError("No updates provided");

        // Get the current report
        const currentReport = await ctx.db.get(id);
        if (!currentReport) {
            throw new ConvexError("Sales report not found");
        }

        // Calculate new values if needed
        const newOpeningStock = updates.openingStock !== undefined ? updates.openingStock : currentReport.openingStock;
        const newAddedStock = updates.addedStock !== undefined ? updates.addedStock : currentReport.addedStock;
        const newRemovedStock = updates.removedStock !== undefined ? updates.removedStock : currentReport.removedStock;
        const newQuantitySold = updates.quantitySold !== undefined ? updates.quantitySold : currentReport.quantitySold;
        const newProductPrice = updates.productPrice !== undefined ? updates.productPrice : currentReport.productPrice;

        // Calculate closing stock if not provided
        if (updates.closingStock === undefined) {
            updates.closingStock = newOpeningStock + newAddedStock - newRemovedStock - newQuantitySold;
        }

        // Calculate sales amount if not provided
        if (updates.salesAmount === undefined) {
            updates.salesAmount = newQuantitySold * newProductPrice;
        }

        return await ctx.db.patch(id, {
            ...updates,
            updatedAt: new Date().toISOString(),
        });
    },
});

// Delete sales report
export const deleteReport = mutation({
    args: {
        id: v.id("salesReport"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.id);
    },
});

// Generate a sales report for a specific period
export const generateReport = mutation({
    args: {
        productId: v.id("products"),
        branchId: v.id("branch"),
        startDate: v.string(),
        endDate: v.string(),
    },
    handler: async (ctx, args) => {
        const { productId, branchId, startDate, endDate } = args;

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

        // Validate dates
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        
        if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
            throw new ConvexError("Invalid date format");
        }
        
        if (startDateObj > endDateObj) {
            throw new ConvexError("Start date must be before end date");
        }

        // Get the product inventory at the branch
        const inventory = await ctx.db
            .query("productInventory")
            .filter((q) => 
                q.and(
                    q.eq(q.field("productId"), productId),
                    q.eq(q.field("branchId"), branchId)
                )
            )
            .first();

        if (!inventory) {
            throw new ConvexError("Product inventory not found for this branch");
        }

        // Get the current stock as opening stock
        const openingStock = inventory.stock;

        // TODO: In a real implementation, you would:
        // 1. Query sales/orders to get quantity sold during the period
        // 2. Query inventory adjustments to get added/removed stock
        // 3. Calculate sales amount based on actual sales data
        
        // For this example, we'll use placeholder values
        const addedStock = 0; // Would be calculated from inventory adjustments
        const removedStock = 0; // Would be calculated from inventory adjustments
        const quantitySold = 0; // Would be calculated from sales/orders
        const productPrice = inventory.price || parseFloat(product.price);
        const salesAmount = quantitySold * productPrice;
        const closingStock = openingStock + addedStock - removedStock - quantitySold;

        // Create the report
        return await ctx.db.insert("salesReport", {
            productId,
            branchId,
            startDate,
            endDate,
            openingStock,
            addedStock,
            removedStock,
            productPrice,
            quantitySold,
            salesAmount,
            closingStock,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    },
}); 
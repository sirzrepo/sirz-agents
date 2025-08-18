import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import {
  getAuthenticatedUser,
  getAuthenticationErrorMessage,
  getNotFoundErrorMessage,
} from "../helpers";
import { filter } from "convex-helpers/server/filter";
import { paginationOptsValidator } from "convex/server";

export const create = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()), // Email is optional
    orderNumber: v.optional(v.string()),
    status: v.optional(v.string()),
    deliveryFee: v.number(),
    total: v.number(),
    deliveryMethod: v.string(),
    deliveryNote: v.optional(v.string()),
    discount: v.optional(v.number()),
    branchId: v.optional(v.id("branch")), // Add branch ID for in-store pickup
    departmentId: v.optional(v.id("departments")), // Optional department association
    attendantId: v.optional(v.id("users")), // Optional attendant association

    products: v.array(
      v.object({
        product: v.string(),
        productId: v.optional(v.id("products")),
        price: v.number(),
        quantity: v.number(),
        image: v.optional(v.string()), // optional if not always provided
      })
  ),
    
    // Address details
    shippingDetails: v.optional(v.object({
        street: v.optional(v.string()),
        region: v.optional(v.string()),
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        country: v.optional(v.string()),
        postalCode: v.optional(v.string()),
        contact: v.optional(v.string()),
    })),
    
    // Paystack payment details
    paymentDetails: v.optional(v.object({
        paymentReference: v.string(),
        paymentStatus: v.string(),
        paymentMethod: v.string(),
        paymentDate: v.number(),
        transactionId: v.string(),
        paymentAmount: v.number(),
        paymentCurrency: v.string(),
        paymentEmail: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    // Generate a unique order number with more information
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const datePart = new Date().getDate().toString().padStart(2, '0');
    const monthPart = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const orderNumber = `ORD-${monthPart}${datePart}${randomPart}`;
    
    const orderId = await ctx.db.insert("orders", {
      ...args,
      orderNumber,
      status: args.status || "pending"
    });
    return await ctx.db.get(orderId);
  },
});

export const list = query({
  args: {
    searchQuery: v.optional(v.string()),
    region: v.optional(v.string()),
    state: v.optional(v.string()),
    country: v.optional(v.string()),
    status: v.optional(v.string()),
    branchId: v.optional(v.id("branch")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { searchQuery, region, state, country, status, branchId  } = args;
    let query = ctx.db.query("orders");

    query = filter(query, (order) => {
      const searchQueryCheck = searchQuery ? order.name.includes(searchQuery) : true;
      const statusCheck = status ? order.status === status : true;
      const regionCheck = region ? order?.shippingDetails?.region === region : true;
      const stateCheck = state ? order?.shippingDetails?.state === state : true;
      const countryCheck = country ? order?.shippingDetails?.country === country : true;
      const branchCheck = branchId ? order.branchId === branchId : true;

      return searchQueryCheck && regionCheck && stateCheck && countryCheck && statusCheck && branchCheck;
    });

    return await query.order("desc").paginate(args.paginationOpts);
  },
});

export const get = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) throw new ConvexError(getNotFoundErrorMessage("Order"));
    return order;
  },
});

export const update = mutation({
  args: {
    id: v.id("orders"),
    name: v.string(),
    email: v.optional(v.string()), // Email is optional
    status: v.optional(v.string()),
    deliveryFee: v.number(),
    discount: v.optional(v.number()),
    total: v.number(),
    deliveryMethod: v.string(),
    deliveryNote: v.optional(v.string()),
    branchId: v.optional(v.id("branch")), // Add branch ID for in-store pickup

    products: v.array(
      v.object({
        product: v.string(),
        productId: v.optional(v.id("products")),
        price: v.number(),
        quantity: v.number(),
        image: v.optional(v.string()), // optional if not always provided
      })
  ),
    
    // Address details
    shippingDetails: v.optional(v.object({
      street: v.optional(v.string()),
      region: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      country: v.optional(v.string()),
      postalCode: v.optional(v.string()),
      contact: v.optional(v.string()),
    })),
    
    // Paystack payment details
    paymentDetails: v.optional(v.object({
        paymentReference: v.string(),
        paymentStatus: v.string(),
        paymentMethod: v.string(),
        paymentDate: v.number(),
        transactionId: v.string(),
        paymentAmount: v.number(),
        paymentCurrency: v.string(),
        paymentEmail: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    const order = await ctx.db.get(id);
    if (!order) throw new ConvexError(getNotFoundErrorMessage("Order"));

    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    const { id } = args;
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    const order = await ctx.db.get(id);
    if (!order) throw new ConvexError(getNotFoundErrorMessage("Order"));

    await ctx.db.delete(id);
  },
});

// get order by a single user
export const listUserOrders = query({
  args: {
    status: v.optional(v.string()), // <-- Add optional status argument
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    let query = ctx.db.query("orders").withIndex("by_email", q =>
      q.eq("email", user.email)
    );

    // ✅ Conditionally filter by status
    if (args.status) {
      query = query.filter(q => q.eq(q.field("status"), args.status));
    }

    return await query.order("desc").paginate(args.paginationOpts);
  },
});


// New query to get an order by order number for tracking
export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    const order = await ctx.db.get(args.id);
    if (!order) throw new ConvexError(getNotFoundErrorMessage("Order"));

    await ctx.db.patch(args.id, { status: args.status });
    return await ctx.db.get(args.id);
  },
});

export const getByOrderNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    const { orderNumber } = args;
    
    // Query orders by order number
    const orders = await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("orderNumber"), orderNumber))
      .collect();
    
    // Return the first matching order or null
    return orders.length > 0 ? orders[0] : null;
  },
});

/**
 * Get all orders for a specific branch
 */
export const getOrdersByBranch = query({
  args: { 
    branchId: v.id("branch"),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("ready"),
      v.literal("delivered")
    ))
  },
  handler: async (ctx, args) => {
    const { branchId, status } = args;
    
    let query = ctx.db
      .query("orders")
      .withIndex("by_branchId", (q) => q.eq("branchId", branchId));
    
    if (status) {
      query = query.filter((q) => q.eq(q.field("status"), status));
    }
    
    return query.collect();
  },
});

/**
 * Get orders filtered by both branch and department
 */
export const getOrdersByBranchAndDepartment = query({
  args: { 
    branchId: v.id("branch"),
    departmentId: v.id("departments"),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("ready"),
      v.literal("delivered")
    ))
  },
  handler: async (ctx, args) => {
    const { branchId, departmentId, status } = args;
    
    let query = ctx.db
      .query("orders")
      .withIndex("by_branchId", (q) => q.eq("branchId", branchId))
      .filter((q) => q.eq(q.field("departmentId"), departmentId));
    
    if (status) {
      query = query.filter((q) => q.eq(q.field("status"), status));
    }
    
    return query.collect();
  },
});

/**
 * Get orders filtered by branch, optional department, and attendant
 */
export const getOrdersByAttendant = query({
  args: { 
    branchId: v.id("branch"),
    departmentId: v.optional(v.id("departments")),
    attendantId: v.id("users"),
    status: v.optional(v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("ready"),
      v.literal("delivered")
    ))
  },
  handler: async (ctx, args) => {
    const { branchId, departmentId, attendantId, status } = args;
    
    let query = ctx.db
      .query("orders")
      .withIndex("by_branchId", (q) => q.eq("branchId", branchId))
      .filter((q) => q.eq(q.field("attendantId"), attendantId));
    
    // Add department filter if provided
    if (departmentId) {
      query = query.filter((q) => q.eq(q.field("departmentId"), departmentId));
    }
    
    // Add status filter if provided
    if (status) {
      query = query.filter((q) => q.eq(q.field("status"), status));
    }
    
    return query.collect();
  },
});

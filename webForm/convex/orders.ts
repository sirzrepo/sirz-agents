import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  handler: async (ctx) => {
    const orders = await ctx.db
      .query('orders')
      .order('desc')
      .collect();
    return orders;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    branchId: v.optional(v.id('branch')),
    products: v.array(
      v.object({
        product: v.string(),
        productId: v.optional(v.id('products')),
        price: v.number(),
        quantity: v.number(),
        image: v.optional(v.string()),
      })
    ),
    deliveryMethod: v.string(),
    deliveryFee: v.number(),
    discount: v.optional(v.number()),
    total: v.number(),
    deliveryNote: v.optional(v.string()),
    shippingDetails: v.optional(
      v.object({
        street: v.optional(v.string()),
        region: v.optional(v.string()),
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        country: v.optional(v.string()),
        postalCode: v.optional(v.string()),
        contact: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const orderId = await ctx.db.insert('orders', {
      ...args,
      orderNumber,
      status: 'pending',
    });

    return orderId;
  },
});

export const updateStatus = mutation({
  args: {
    orderId: v.id('orders'),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const { orderId, status } = args;
    await ctx.db.patch(orderId, { status });
    return true;
  },
});

export const getOrder = query({
  args: { orderId: v.id('orders') },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    return order;
  },
});

export const getOrdersByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query('orders')
      .withIndex('by_status', (q) => q.eq('status', args.status))
      .collect();
    return orders;
  },
});

import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import { getAuthenticatedUser, getAuthenticationErrorMessage, getAuthorizationErrorMessage, getNotFoundErrorMessage } from "../helpers";
import { paginationOptsValidator } from "convex/server";

/**
 * Initialize or get a user's cashback account
 */
export const initializeAccount = mutation({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    // Use the authenticated user's ID if no userId is provided
    const userId = args.userId || user._id;

    // Check if user already has a cashback account
    const existingAccount = await ctx.db
      .query("cashbacks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingAccount) {
      // User already has a cashback account
      return existingAccount;
    }

    // Create a new cashback account for the user
    const accountId = await ctx.db.insert("cashbacks", {
      userId,
      totalEarned: 0,
      totalUsed: 0,
      available: 0,
    });

    return await ctx.db.get(accountId);
  },
});

/**
 * Get a user's cashback balance
 */
export const getBalance = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    // Use the authenticated user's ID if no userId is provided
    const userId = args.userId || user._id;

    // Only allow users to view their own cashback balance or admins
    if (userId !== user._id) {
      throw new ConvexError(getAuthorizationErrorMessage());
    }

    const cashback = await ctx.db
      .query("cashbacks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!cashback) {
      // If no cashback account exists, initialize one
      return {
        totalEarned: 0,
        totalUsed: 0,
        available: 0,
      };
    }

    return cashback;
  },
});

/**
 * Add cashback to a user's account after a completed order
 */
export const addCashback = mutation({
  args: {
    userId: v.id("users"),
    orderId: v.id("orders"),
    orderTotal: v.number(),
    percentage: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId, orderId, orderTotal, percentage = 5 } = args;
    const user = await getAuthenticatedUser(ctx);

    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    // Verify the order exists and is completed
    const order = await ctx.db.get(orderId);
    if (!order) {
      throw new ConvexError(getNotFoundErrorMessage("Order"));
    }

    if (order.status !== "delivered") {
      throw new ConvexError("Cannot add cashback for non-delivered orders");
    }

    // Check if cashback has already been added for this order
    const existingCashbackRecord = await ctx.db
      .query("cashbackRecords")
      .withIndex("by_order", (q) => q.eq("orderId", orderId))
      .first();

    if (existingCashbackRecord) {
      throw new ConvexError("Cashback has already been added for this order");
    }

    // Calculate the cashback amount
    const amount = (orderTotal * percentage) / 100;

    // Get or create the user's cashback account
    let cashback = await ctx.db
      .query("cashbacks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!cashback) {
      // Initialize a new cashback account
      const accountId = await ctx.db.insert("cashbacks", {
        userId,
        totalEarned: amount,
        totalUsed: 0,
        available: amount,
      });
      
      // Record this cashback transaction
      await ctx.db.insert("cashbackRecords", {
        userId,
        orderId,
        amount,
        percentage,
        transactionType: "earn",
        createdAt: Date.now(),
      });
      
      return await ctx.db.get(accountId);
    }

    // Update the existing cashback account
    const totalEarnedNum = (cashback.totalEarned || 0) + amount;
    const availableNum = (cashback.available || 0) + amount;

    const updatedCashback = await ctx.db.patch(cashback._id, {
      totalEarned: totalEarnedNum,
      available: availableNum,
    });

    // Record this cashback transaction
    await ctx.db.insert("cashbackRecords", {
      userId,
      orderId,
      amount,
      percentage,
      transactionType: "earn",
      createdAt: Date.now(),
    });

    return updatedCashback;
  },
});

/**
 * Use cashback during checkout
 */
export const useCashback = mutation({
  args: {
    userId: v.optional(v.id("users")),
    amount: v.number(),
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const { amount, orderId } = args;
    const user = await getAuthenticatedUser(ctx);

    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    // Use the authenticated user's ID if no userId is provided
    const userId = args.userId || user._id;

    // Only allow users to use their own cashback
    if (userId !== user._id) {
      throw new ConvexError(getAuthorizationErrorMessage());
    }

    // Get the user's cashback account
    const cashback = await ctx.db
      .query("cashbacks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!cashback) {
      throw new ConvexError("No cashback account found for this user");
    }

    // Check if user has enough cashback balance
    if ((cashback.available || 0) < amount) {
      throw new ConvexError(`Insufficient cashback balance. Available: ${cashback.available}, Requested: ${amount}`);
    }

    // Update the cashback account
    const totalUsedNum = (cashback.totalUsed || 0) + amount;
    const availableNum = (cashback.available || 0) - amount;

    const updatedCashback = await ctx.db.patch(cashback._id, {
      totalUsed: totalUsedNum,
      available: availableNum,
    });

    // Record this cashback usage transaction
    await ctx.db.insert("cashbackRecords", {
      userId,
      orderId,
      amount,
      percentage: 0, // Not applicable for usage
      transactionType: "use",
      createdAt: Date.now(),
    });

    return {
      success: true,
      updatedCashback,
      amountUsed: amount,
    };
  },
});

/**
 * Get a user's cashback transaction history
 */
export const getTransactionHistory = query({
  args: {
    userId: v.optional(v.id("users")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    // Use the authenticated user's ID if no userId is provided
    const userId = args.userId || user._id;

    // Only allow users to view their own transaction history or admins
    if (userId !== user._id) {
      throw new ConvexError(getAuthorizationErrorMessage());
    }

    const transactions = await ctx.db
      .query("cashbackRecords")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate(args.paginationOpts);

    return transactions;
  },
});

/**
 * Admin function to list all cashback accounts
 */
export const listAllAccounts = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    // Check if user is an admin (you may need to adjust this based on your user roles)
    // if (!user.isAdmin) {
    //   throw new ConvexError(getAuthorizationErrorMessage());
    // }

    const results = await ctx.db
      .query("cashbacks")
      .order("desc")
      .paginate(args.paginationOpts);

    return results;
  },
});

/**
 * Admin function to list all cashback transactions
 */
export const listAllTransactions = query({
  args: {
    paginationOpts: paginationOptsValidator,
    transactionType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    // Check if user is an admin (you may need to adjust this based on your user roles)
    // if (!user.isAdmin) {
    //   throw new ConvexError(getAuthorizationErrorMessage());
    // }

    let query = ctx.db.query("cashbackRecords");
    
    if (args.transactionType) {
      query = query.filter((q) => q.eq(q.field("transactionType"), args.transactionType || ""));
    }

    const results = await query
      .order("desc")
      .paginate(args.paginationOpts);

    return results;
  },
});

/**
 * Calculate cashback amount based on order total and percentage
 */
export const calculateCashbackAmount = query({
  args: {
    orderTotal: v.number(),
    percentage: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    console.log("ctx", ctx)
    const { orderTotal, percentage = 5 } = args; // Default to 5% cashback if not specified
    
    // Calculate the cashback amount
    const cashbackAmount = (orderTotal * percentage) / 100;
    
    return {
      orderTotal,
      percentage,
      cashbackAmount,
    };
  },
});
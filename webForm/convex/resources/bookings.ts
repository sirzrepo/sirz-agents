import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { filter } from "convex-helpers/server/filter";
import message from "../tables/message";

export const create = mutation({
    args: {
        listingId: v.id("listing"),
        buyerId: v.id("users"),
        sellerId: v.id("users"),
        status: v.optional(v.string()),

        seller: v.optional(v.object({
            name: v.optional(v.string()),
            email: v.optional(v.string()),
            phone: v.optional(v.string()),
        })),
        
        buyer: v.optional(v.object({
            name: v.optional(v.string()),
            email: v.optional(v.string()),
            phone: v.optional(v.string()),
        })),
        
        bookingData: v.optional(v.object({
            phone: v.optional(v.string()),
            preferredDate: v.optional(v.string()),
            quantity: v.optional(v.number()),
            deliveryMethod: v.optional(v.string()),
            message: v.optional(v.string()),
            price: v.optional(v.number()),
        })),

        paymentDetails: v.optional(v.object({
            bookingFeePaid: v.optional(v.boolean()),
            bookingFeeAmount: v.optional(v.number()),
            paymentReference: v.optional(v.string()),
            paymentStatus: v.optional(v.string()),
            paidAt: v.optional(v.number()),
        })),
        deliveryAddress: v.optional(v.object({
            street: v.optional(v.string()),
            city: v.optional(v.string()),
            state: v.optional(v.string()),
        })),
    },
    handler: async (ctx, args) => {
        const { listingId, buyerId, sellerId, paymentDetails, bookingData, deliveryAddress } = args;
        let { status, seller, buyer } = args;

        if (!status) {
            status = 'pending';
        }

        // Get the listing to check current quantity
        const listing = await ctx.db.get(listingId);
        if (!listing) {
            throw new Error('Listing not found');
        }

        const currentQuantity = listing.quantity || 1;
        
        // Check if there's enough quantity available
        if (currentQuantity < (bookingData?.quantity || 1)) {
            throw new Error(`Only ${currentQuantity} items available`);
        }

        const now = Date.now();
        
        // Create the booking
        const bookingId = await ctx.db.insert("bookings", {
            listingId,
            buyerId,
            sellerId,
            status,
            seller,
            buyer,
            paymentDetails,
            bookingData,
            deliveryAddress,
            createdAt: now,
            updatedAt: now
        });

        // Update the listing based on quantity
        if (currentQuantity === 1) {
            // If only one item, mark as sold and booked
            await ctx.db.patch(listingId, {
                isBooked: true,
                isSold: true,
                quantity: 0
            });
        } else {
            // Reduce the available quantity
            const newQuantity = currentQuantity - (bookingData?.quantity || 1);
            await ctx.db.patch(listingId, {
                quantity: newQuantity,
                // If all items are booked, mark as sold
                isSold: newQuantity === 0
            });
        }

        return bookingId;
    },
});

export const list = query({
    args: {
        paginationOpts: paginationOptsValidator,
        status: v.optional(v.string()),
        listingId: v.optional(v.id("listing")),
        buyerId: v.optional(v.id("users")),
        sellerId: v.optional(v.id("users")),

        seller: v.optional(v.object({
          name: v.optional(v.string()),
          email: v.optional(v.string()),
          phone: v.optional(v.string()),
        })),
        
        buyer: v.optional(v.object({
          name: v.optional(v.string()),
          email: v.optional(v.string()),
          phone: v.optional(v.string()),
        })),

        bookingData: v.optional(v.object({
            phone: v.optional(v.string()),
            quantity: v.optional(v.number()),
            preferredDate: v.optional(v.string()),
            message: v.optional(v.string()),
            deliveryMethod: v.optional(v.string()),
            price: v.optional(v.number()),
        })),

        deliveryAddress: v.optional(v.object({
            street: v.optional(v.string()),
            city: v.optional(v.string()),
            state: v.optional(v.string()),
        })),

        paymentDetails: v.optional(v.object({
            bookingFeePaid: v.optional(v.boolean()),
            bookingFeeAmount: v.optional(v.number()),
            paymentReference: v.optional(v.string()),
            paymentStatus: v.optional(v.string()),
            paidAt: v.optional(v.number()),
        })),
    },
    handler: async (ctx, args) => {
        const { paginationOpts, status, listingId, buyerId, sellerId, bookingData, paymentDetails } = args;

        // Build the query with the appropriate index based on the provided filters
        const queryBuilder = ctx.db
            .query("bookings")
            .withIndex(
                listingId ? "by_listing" : 
                buyerId ? "by_buyer" : 
                sellerId ? "by_seller" : "by_creation_time",
                (q) => {
                    if (listingId) return q.eq("listingId", listingId);
                    if (buyerId) return q.eq("buyerId", buyerId);
                    if (sellerId) return q.eq("sellerId", sellerId);
                    return q; // For by_creation_time, no filter needed
                }
            );

        // First, get all results with the current query
        let results = await queryBuilder.collect();

        // Apply in-memory filters if provided
        if (status) {
            results = results.filter(booking => booking.status === status);
        }

        if (bookingData?.quantity !== undefined) {
            results = results.filter(booking => booking.bookingData?.quantity === bookingData.quantity);
        }

        if (paymentDetails) {
            results = results.filter(booking => booking.paymentDetails === paymentDetails);
        }

        // Apply pagination
        const start = (paginationOpts.cursor ? Number(paginationOpts.cursor) : 0);
        const end = start + paginationOpts.numItems;
        const paginatedResults = results.slice(start, end);

        // Get related data for the paginated results
        const bookingsWithDetails = await Promise.all(
            paginatedResults.map(async (booking) => {
                const [listing, buyer, seller] = await Promise.all([
                    booking.listingId ? ctx.db.get(booking.listingId) : null,
                    booking.buyerId ? ctx.db.get(booking.buyerId) : null,
                    booking.sellerId ? ctx.db.get(booking.sellerId) : null
                ]);

                return {
                    ...booking,
                    listing,
                    buyer,
                    seller,
                };
            })
        );

        // Return the paginated results with the additional data
        return {
            page: bookingsWithDetails,
            isDone: end >= results.length,
            continueCursor: end < results.length ? String(end) : undefined,
        };
    }
});

export const update = mutation({
    args: {
        id: v.id("bookings"),
        status: v.optional(v.string()),
        quantity: v.optional(v.number()),

        seller: v.optional(v.object({
          name: v.optional(v.string()),
          email: v.optional(v.string()),
          phone: v.optional(v.string()),
        })),
        buyer: v.optional(v.object({
          name: v.optional(v.string()),
          email: v.optional(v.string()),
          phone: v.optional(v.string()),
        })),

        bookingData: v.optional(v.object({
            phone: v.optional(v.string()),
            quantity: v.optional(v.number()),
            preferredDate: v.optional(v.string()),
            message: v.optional(v.string()),
            deliveryMethod: v.optional(v.string()),
            price: v.optional(v.number()),
        })),

        paymentDetails: v.optional(v.object({
            bookingFeePaid: v.optional(v.boolean()),
            bookingFeeAmount: v.optional(v.number()),
            paymentReference: v.optional(v.string()),
            paymentStatus: v.optional(v.string()),
            paidAt: v.optional(v.number()),
        })),
        deliveryAddress: v.optional(v.object({
            street: v.optional(v.string()),
            city: v.optional(v.string()),
            state: v.optional(v.string()),
        })),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;

        // If updating paymentDetails, ensure required fields are preserved
        if (updates.paymentDetails) {
            const existing = await ctx.db.get(id);
            updates.paymentDetails = {
                ...existing?.paymentDetails, // Keep existing values
                ...updates.paymentDetails,   // Apply updates
            };
        }
        
        // Always update the updatedAt timestamp
        const updateData = {
            ...updates,
            updatedAt: Date.now()
        };

        return await ctx.db.patch(id, updateData);
    },
});

export const getByUser = query({
    args: {
        userId: v.id("users"),
        status: v.optional(v.string()),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const { userId, status, paginationOpts } = args;

        // First, get all bookings where the user is either buyer or seller
        const buyerQuery = ctx.db
            .query("bookings")
            .withIndex("by_buyer", q => q.eq("buyerId", userId));
            
        const sellerQuery = ctx.db
            .query("bookings")
            .withIndex("by_seller", q => q.eq("sellerId", userId));

        // Execute both queries in parallel
        const [buyerBookings, sellerBookings] = await Promise.all([
            buyerQuery.collect(),
            sellerQuery.collect(),
        ]);

        // Combine and deduplicate results (in case user is both buyer and seller)
        const allBookings = [...buyerBookings, ...sellerBookings];
        const uniqueBookings = Array.from(new Map(
            allBookings.map(booking => [booking._id, booking])
        ).values());

        // Apply status filter if provided
        let filteredBookings = status 
            ? uniqueBookings.filter(booking => booking.status === status)
            : uniqueBookings;

        // Sort by creation time (newest first)
        filteredBookings.sort((a, b) => b._creationTime - a._creationTime);

        // Apply pagination
        const start = paginationOpts.cursor ? Number(paginationOpts.cursor) : 0;
        const end = start + paginationOpts.numItems;
        const paginatedBookings = filteredBookings.slice(start, end);

        // Fetch listing details and use embedded buyer/seller info
        const bookingsWithDetails = await Promise.all(
            paginatedBookings.map(async (booking) => {
                const listing = booking.listingId ? await ctx.db.get(booking.listingId) : null;
                
                return {
                    ...booking,
                    listing,
                    // Use embedded buyer/seller info if available, otherwise fall back to user info
                    buyer: booking.buyer || { _id: booking.buyerId },
                    seller: booking.seller || { _id: booking.sellerId },
                    // Add a flag to indicate if the current user is the buyer or seller
                    userRole: booking.buyerId === userId ? 'buyer' : 'seller',
                };
            })
        );

        return {
            page: bookingsWithDetails,
            isDone: end >= filteredBookings.length,
            continueCursor: end < filteredBookings.length ? String(end) : undefined,
            totalCount: filteredBookings.length,
        };
    },
});

export const getTotalEarnings = query({
    args: {
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const { userId } = args;

        // Get all completed bookings where the user is the seller
        const bookings = await ctx.db
            .query("bookings")
            .withIndex("by_seller", q => q.eq("sellerId", userId))
            .filter(q => q.eq(q.field("status"), "completed"))
            .collect();

        // Calculate total earnings by summing up the prices of all bookings
        const totalEarnings = bookings.reduce((sum, booking) => {
            const price = booking.bookingData?.price || 0;
            const quantity = booking.bookingData?.quantity || 1;
            return sum + (price * quantity);
        }, 0);

        return totalEarnings;
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("bookings"),
        status: v.union(
            v.literal("pending"),
            v.literal("confirmed"),
            v.literal("completed"),
            v.literal("cancelled"),
            v.literal("rejected"),
            v.literal("expired")
        ),
        statusReason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, status, statusReason } = args;
        
        // Get the current booking
        const booking = await ctx.db.get(id);
        if (!booking) {
            throw new Error("Booking not found");
        }

        // Update the booking with new status and reason
        await ctx.db.patch(id, {
            status,
            statusReason,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

export const remove = mutation({
    args: {
        id: v.id("bookings"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
}); 
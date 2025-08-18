import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    listingId: v.id("listing"),
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    status: v.string(), // e.g. "pending", "confirmed", "cancelled", "completed", "rejected", "expired"
    statusReason: v.optional(v.string()),

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
      message: v.optional(v.string()),
      deliveryMethod: v.optional(v.string()),
      quantity: v.optional(v.number()),
      price: v.optional(v.number()),
    })),

    // escrow: v.optional(v.object({
    //   amount: v.number(), // total amount held
    //   bookingFeeAmount: v.optional(v.number()), // optional upfront
    //   bookingFeePaid: v.optional(v.boolean()),
  
    //   status: v.string(), // "held", "released", "refunded", "disputed"
    //   heldAt: v.number(),
    //   releasedAt: v.optional(v.number()),
    //   refundedAt: v.optional(v.number()),
  
    //   paymentReference: v.optional(v.string()),
    //   paymentStatus: v.optional(v.string()), // "paid", "pending", "failed"
  
    //   disputeReason: v.optional(v.string()),
    //   disputeRaisedAt: v.optional(v.number()),
    //   resolution: v.optional(v.string()),
    // })),
    
    
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
    createdAt: v.number(), // timestamp (Date.now())
    updatedAt: v.optional(v.number())
  })
  .index("by_listing", ["listingId"])
  .index("by_buyer", ["buyerId"])
  .index("by_seller", ["sellerId"])
  .index("by_status", ["status"])
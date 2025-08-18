import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    name: v.string(),
    email: v.optional(v.string()), // Email is optional
    branchId: v.optional(v.id("branch")), // Add branch ID for in-store pickup
    departmentId: v.optional(v.id("departments")), // Optional department association
    attendantId: v.optional(v.id("users")), // Optional attendant association
    orderNumber: v.optional(v.string()),
    status: v.optional(v.string()),
    deliveryFee: v.number(),
    discount: v.optional(v.number()),
    total: v.number(),
    deliveryMethod: v.string(),
    deliveryNote: v.optional(v.string()),

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
})
.index("by_email", ["email"]) // Index for email
.index("by_name", ["name"]) // Index for name
.index("by_status", ["status"]) // Index for status
.index("by_branchId", ["branchId"]) // Index for branch
.index("by_departmentId", ["departmentId"]) // Index for department
.index("by_country", ["shippingDetails.country"]) // Index for shipping country
.index("by_state", ["shippingDetails.state"]) // Index for shipping state
.index("by_region", ["shippingDetails.region"]) // Index for shipping region
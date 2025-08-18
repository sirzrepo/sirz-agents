import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    title: v.string(),
    description: v.string(),
    keyFeatures: v.optional(v.array(v.string())),
    images: v.array(v.string()),
    category: v.string(),
    subcategory: v.string(),
    condition: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    isNegotiable: v.boolean(),
    merchantId: v.id("users"), // Optional attendant association
    isBooked: v.optional(v.boolean()),
    isSold: v.optional(v.boolean()),
    bookingFee: v.optional(v.number()),
    deliveryFee: v.optional(v.number()),
    deliveryMethod: v.optional(v.array(v.string())),
    deliveryNote: v.optional(v.string()),
    quantity: v.optional(v.number()),
    autoAcceptBookings: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    discount: v.optional(v.number()),
    status: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    contact: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
  
    // Address details
    address: v.optional(v.object({
        street: v.optional(v.string()),
        region: v.optional(v.string()),
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        country: v.optional(v.string()),
        postalCode: v.optional(v.string()),
    })),
})
.index("by_title", ["title"]) 
.index("by_category", ["category"]) 
.index("by_condition", ["condition"]) 
.index("by_price", ["price"]) 
.index("by_isNegotiable", ["isNegotiable"]) 
.index("by_isBooked", ["isBooked"])
.index("by_isSold", ["isSold"]) 
.index("by_bookingFee", ["bookingFee"]) 
.index("by_deliveryFee", ["deliveryFee"])
.index("by_deliveryMethod", ["deliveryMethod"]) 
.index("by_deliveryNote", ["deliveryNote"]) 
.index("by_quantity", ["quantity"]) 
.index("by_discount", ["discount"]) 
.index("by_merchantId", ["merchantId"]) 
.index("by_country", ["address.country"]) 
.index("by_state", ["address.state"]) 
.index("by_region", ["address.region"]) 
.index("by_featured", ["featured"]) 
  
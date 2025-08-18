import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    userId: v.id("users"),
    businessName: v.optional(v.string()),
    type: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    referralCode: v.optional(v.string()),
    verified: v.optional(v.boolean()),
    isActive: v.optional(v.boolean()),
    rating: v.optional(v.number()),
    listingCount: v.optional(v.number()),
    totalSales: v.optional(v.number()),

    // document details
    documentDetails: v.optional(v.object({
        identityType: v.optional(v.string()),
        identityNumber: v.optional(v.string()),
        identityDocumentUrl: v.optional(v.string()),
        businessLogoUrl: v.optional(v.string()),
    })),

    // Bank details
    bankDetails: v.optional(v.object({
        bankName: v.optional(v.string()),
        accountNumber: v.optional(v.string()),
        accountName: v.optional(v.string()),
    })),

    // Address details
    address: v.optional(v.object({
        street: v.optional(v.string()),
        region: v.optional(v.string()),
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        country: v.optional(v.string()),
        postalCode: v.optional(v.string()),
        contact: v.optional(v.string()),
        whatsapp: v.optional(v.string()),
    })),
})
    .index('email', ['email'])
    .index("phone", ["phone"])
    .index("userId", ["userId"])
    .index("businessName", ["businessName"])
    .index("type", ["type"])
    .index("verified", ["verified"])
    .index("isActive", ["isActive"])
    .index("listingCount", ["listingCount"])
    .index("totalSales", ["totalSales"])

  
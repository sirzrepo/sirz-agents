// import { defineTable } from "convex/server";
// import { v } from "convex/values";

// export default defineTable({
//     name: v.optional(v.string()),
//     image: v.optional(v.string()),
//     email: v.optional(v.string()),
//     emailVerificationTime: v.optional(v.number()),
//     phone: v.optional(v.string()),
//     phoneVerificationTime: v.optional(v.number()),
//     username: v.optional(v.string()),
//     affiliated: v.optional(v.boolean()),
//     active: v.optional(v.boolean()),
//     branchId: v.optional(v.id("branch")),
//     departmentId: v.optional(v.id("departments")),
// })
//     .index('email', ['email'])
//     .index("phone", ["phone"])
//     .index("username", ["username"])
//     .index("active", ["active"])



import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
  // Basic user info
  name: v.optional(v.string()),
  image: v.optional(v.string()),
  email: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  phone: v.optional(v.string()),
  phoneVerificationTime: v.optional(v.number()),
  username: v.optional(v.string()),
  bio: v.optional(v.string()),
  location: v.optional(v.string()),


  // Internal system links
  affiliated: v.optional(v.boolean()),
  active: v.optional(v.boolean()),

  // Marketplace/merchant fields
  businessName: v.optional(v.string()),
  type: v.optional(v.string()),
  referralCode: v.optional(v.string()),
  verified: v.optional(v.boolean()),
  isActive: v.optional(v.boolean()),
  approvalStatus: v.optional(v.string()), // pending, approved, rejected, suspended

  // Document details
  documentDetails: v.optional(
    v.object({
      identityType: v.optional(v.string()),
      identityNumber: v.optional(v.string()),
      identityDocumentUrl: v.optional(v.string()),
      identityDocumentBackUrl: v.optional(v.string()),
      selfieDocumentUrl: v.optional(v.string()),
      businessLogoUrl: v.optional(v.string()),
    })
  ),

  // Bank details
  bankDetails: v.optional(
    v.object({
      bankName: v.optional(v.string()),
      accountNumber: v.optional(v.string()),
      accountName: v.optional(v.string()),
      bvn: v.optional(v.string()),
    })
  ),

  // Address
  address: v.optional(
    v.object({
      street: v.optional(v.string()),
      region: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      country: v.optional(v.string()),
      postalCode: v.optional(v.string()),
      contact: v.optional(v.string()),
      whatsapp: v.optional(v.string()),
    })
  ),
})
  .index("email", ["email"])
  .index("phone", ["phone"])
  .index("username", ["username"])
  .index("active", ["active"])
  .index("businessName", ["businessName"])
  .index("type", ["type"])
  .index("verified", ["verified"])
  .index("isActive", ["isActive"])
  .index("approvalStatus", ["approvalStatus"]);

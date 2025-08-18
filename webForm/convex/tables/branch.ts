import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
  name: v.string(),
  phone: v.string(),
  email: v.optional(v.string()),
  isActive: v.boolean(),
  isHeadOffice: v.optional(v.boolean()),

  // Address details with geolocation
  address: v.optional(v.object({
    street: v.optional(v.string()),
    region: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    country: v.optional(v.string()),
    postalCode: v.optional(v.string()),
    contact: v.optional(v.string()),
    latitude: v.optional(v.number()),   // Added
    longitude: v.optional(v.number()),  // Added
  })), 

  createdAt: v.string(),
  updatedAt: v.optional(v.string()),
})
  .index('by_name', ['name'])
  .index('by_active_status', ['isActive']);

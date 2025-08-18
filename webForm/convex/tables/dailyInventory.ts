import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
  productId: v.id("products"),
  branchId: v.id("branch"),
  date: v.string(),
  initialStock: v.number(),
  addedStock: v.number(),
  removedStock: v.number(),
  quantitySold: v.number(),
  salesAmount: v.number(),
  closingStock: v.number(),
  notes: v.optional(v.string()),
  createdAt: v.string(),
  updatedAt: v.optional(v.string()),
})
  .index('by_product', ['productId'])
  .index('by_branch', ['branchId'])
  .index('by_date', ['date'])
  .index('by_product_and_branch', ['productId', 'branchId'])
  .index('by_product_branch_date', ['productId', 'branchId', 'date']);

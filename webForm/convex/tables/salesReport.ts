import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
  productId: v.id("products"),
  branchId: v.id("branch"),
  startDate: v.string(), // ISO date string
  endDate: v.string(), // ISO date string
  openingStock: v.number(),
  addedStock: v.number(),
  removedStock: v.number(),
  productPrice: v.number(),
  quantitySold: v.number(),
  salesAmount: v.number(),
  closingStock: v.number(),
  notes: v.optional(v.string()),
  createdAt: v.string(),
  updatedAt: v.string(),
}).index("by_product", ["productId"])
  .index("by_branch", ["branchId"])
  .index("by_date_range", ["startDate", "endDate"])
  .index("by_product_and_branch", ["productId", "branchId"])
  .index("by_product_branch_and_date", ["productId", "branchId", "startDate", "endDate"]); 
import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
  productId: v.id("products"),
  branchId: v.id("branch"),
  departmentId: v.optional(v.id("departments")), // Optional department association
  stock: v.number(),
  isAvailableAtBranch: v.boolean(), // Local availability at this branch
  price: v.optional(v.number()), // Optional override of global price
  createdAt: v.string(),
  updatedAt: v.optional(v.string()),
})
  .index('by_product', ['productId'])
  .index('by_branch', ['branchId'])
  .index('by_department', ['departmentId'])
  .index('by_product_and_branch', ['productId', 'branchId'])
  .index('by_branch_availability', ['branchId', 'isAvailableAtBranch']); 
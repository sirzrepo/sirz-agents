import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    roleId: v.id('roles'),
    userId: v.id('users'),
})
    .index('by_role', ['roleId'])
    .index('by_user', ['userId'])
    .index('by_role_user', ['userId', 'roleId'])
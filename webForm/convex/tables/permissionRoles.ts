import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    permissionId: v.id('permissions'),
    roleId: v.id('roles')
})
    .index('by_role', ['roleId'])
    .index('by_permission', ['permissionId'])
    .index('by_permission_role', ['permissionId', 'roleId'])
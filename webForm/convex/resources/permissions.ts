import { v } from "convex/values";
import { query } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { filter } from "convex-helpers/server/filter";

// Get all permissions.
export const listAll = query({
    args: {
        roleName: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { roleName } = args

        // Get permission id for a given role name
        let permissionIds: Id<"permissions">[] = []

        if (roleName) {
            const role = await ctx.db.query('roles')
                .withIndex('by_name', (q) => q.eq('name', roleName))
                .first()

            if (role) {
                const permissionRoles = await ctx.db.query('permissionRoles')
                    .withIndex('by_role', (q) => q.eq('roleId', role._id))
                    .collect()

                permissionIds = permissionRoles.map(item => item.permissionId)
            }
        }

        let query = ctx.db.query('permissions')

        if (roleName) {
            query = filter(
                ctx.db.query('permissions'),
                (permission) => {
                    let value = false

                    if (roleName && permissionIds.length > 0) {
                        value = permissionIds.includes(permission._id)
                    }

                    return value
                }
            )
        }

        return await query.order('desc').collect()
    },
});
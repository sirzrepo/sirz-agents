import { PaginationOptions } from "convex/server"
import { ConvexError } from "convex/values"
import { MutationCtx, QueryCtx } from "../_generated/server"
import { filter } from "convex-helpers/server/filter"
import { Doc, Id } from "../_generated/dataModel"
// import { syncPermissionsWithRoleById } from "./permissions"


export const SUPER_ADMIN_ROLE = 'super admin' // - Full system access
export const BRANCH_MANAGER_ROLE = 'branch manager' // - CMS and media access
export const DEPARTMENT_HEAD_ROLE = 'department head' // - E-commerce and order management
export const SALES_REP_ROLE = 'sales rep' // - Experience room and event management
export const CUSTOMER_SERVICE_ROLE = 'customer service' // - Customer service and order tracking
export const USER_ROLE = 'user' // - User role


export const CREATE_USERS_PERMISSION = 'users.create';
export const READ_USERS_PERMISSION = 'users.read';
export const UPDATE_USERS_PERMISSION = 'users.update';
export const DEACTIVATE_USERS_PERMISSION = 'users.deactivate'

export const rolesPermissions = [
    {
        roleName: SUPER_ADMIN_ROLE,
        permissionNames: [
            CREATE_USERS_PERMISSION,
            READ_USERS_PERMISSION,
            UPDATE_USERS_PERMISSION,
            DEACTIVATE_USERS_PERMISSION
        ]
    },
    {
        roleName: BRANCH_MANAGER_ROLE,
        permissionNames: []
    },
    {
        roleName: DEPARTMENT_HEAD_ROLE,
        permissionNames: []
    },
    {
        roleName: SALES_REP_ROLE,
        permissionNames: []
    },
    {
        roleName: CUSTOMER_SERVICE_ROLE,
        permissionNames: []
    },
    {
        roleName: USER_ROLE,
        permissionNames: []
    }
]

export const getPermissionsByNames = (ctx: QueryCtx, permissionNames: string[]) => {
    return filter(
        ctx.db.query('permissions'),
        (permission) => permissionNames.includes(permission.name)
    ).collect()
}

export const getPermissionsAndMissingPermissionNames = async (ctx: MutationCtx, permissionNames: string[]) => {
    const permissions = await getPermissionsByNames(ctx, permissionNames);
    const missingPermissionNames = getMissingPermissionNames(permissions, permissionNames);

    return { permissions, missingPermissionNames }
}

export const getMissingPermissionNames = (permissions: Doc<'permissions'>[], permissionNames: string[]) => {
    const existingPermissionNames = permissions.map(item => item.name)
    return permissionNames.filter(item => !existingPermissionNames.includes(item))
}

export const syncPermissionsWithRoleById = async (ctx: MutationCtx, existingPermissions: Doc<'permissions'>[], roleId: Id<'roles'>) => {
    const permissionRoleIds = existingPermissions.map(item => {
        return {
            permissionId: item._id,
            roleId
        }
    })

    const permissionRoles = await filter(
        ctx.db.query('permissionRoles'),
        (permissionRole) => {
            let value = true

            value = value && permissionRoleIds
                .some(item => item.permissionId === permissionRole.permissionId && item.roleId === permissionRole.roleId)

            return value
        }
    ).collect()

    const syncablePermissionRoleIds = permissionRoleIds.filter(item => {
        return !permissionRoles
            .some(permissionRole => permissionRole.permissionId === item.permissionId && permissionRole.roleId == item.roleId)
    })

    const syncPermissionsOperations = syncablePermissionRoleIds
        .map(item => {
            return ctx.db.insert('permissionRoles', {
                roleId: item.roleId,
                permissionId: item.permissionId
            });
        });

    if (syncPermissionsOperations.length > 0) {
        await Promise.all(syncPermissionsOperations);
    }
}

export const getMissingRoleNames = async (ctx: QueryCtx, roleNames: string[]) => {
    const roles = await ctx.db.query('roles')
        .collect()

    const existingRoleNames = roles.map(item => item.name)
    return roleNames.filter(item => {
        if (existingRoleNames.length > 0) {
            return !existingRoleNames.includes(item)
        }

        return true
    })
}

export const insertRoles = async (ctx: MutationCtx, roleNames: string[]) => {
    const insertRoleOperations = roleNames.map(roleName => {
        return ctx.db.insert('roles', {
            name: roleName
        })
    })

    if (insertRoleOperations.length > 0) {
        await Promise.all(insertRoleOperations)
    }
}

export const getRolesByNames = async (ctx: QueryCtx, rolenames: string[]) => {
    return await filter(
        ctx.db.query('roles'),
        role => rolenames.includes(role.name)
    ).collect()
}

export const queryRolesList = async (ctx: QueryCtx, args: { userId?: Id<'users'> | undefined, paginationOpts?: PaginationOptions | undefined, roleName?: string }) => {
    const { userId, paginationOpts, roleName } = args
    let query = ctx.db.query('roles')

    if (userId || roleName) {
        let roleId: Id<'roles'> | undefined

        if (userId) {
            const roleUser = await getRoleUserByUserId(ctx, userId);
            roleId = roleUser?.roleId;
        }

        query = filter(
            ctx.db.query('roles'),
            (role) => {
                const userIdCheck = userId
                    ? roleId === role._id
                    : true
                const roleNameCheck = roleName
                    ? role.name === roleName
                    : true


                return userIdCheck && roleNameCheck
            }
        )
    }

    if (paginationOpts) {
        return {
            paginatedResults: await query.order('desc')
                .paginate(paginationOpts)
        }
    }

    return {
        results: await query.order('desc')
            .collect()
    }
}

export const getRoleByUserId = async (ctx: QueryCtx, userId: Id<'users'>) => {
    const userRole = await getRoleUserByUserId(ctx, userId)

    if (userRole) {
        return await getRoleById(ctx, userRole.roleId)
    }

    return null
}

export const getRoleUserByUserId = async (ctx: QueryCtx, userId: Id<'users'>) => {
    return await ctx.db.query('roleUsers')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .unique()
}

export const getRoleById = async (ctx: QueryCtx, id: Id<'roles'>) => {
    return await ctx.db.get(id);
}

export const getRoleByName = async (ctx: MutationCtx, name: string) => {
    return await ctx.db.query("roles")
        .withIndex("by_name", (q) => q.eq("name", name))
        .first();
}

export const updateRolePermissions = async (ctx: MutationCtx, roleId: Id<'roles'>, permissionNames: string[]) => {
    // Make sure all the permission names exist.
    const { permissions, missingPermissionNames } = await getPermissionsAndMissingPermissionNames(ctx, permissionNames)

    if (missingPermissionNames.length !== 0) {
        throw new ConvexError(`Permission names: ${permissionNames.join(', ')} do not exist.`)
    }

    // Sync permission names
    await syncPermissionsWithRoleById(ctx, permissions, roleId)
}

export const linkUserRole = async (ctx: MutationCtx, userId: Id<'users'>, roleName: string) => {
    // Make sure all the role name exists.
    const existingRole = await getRoleByName(ctx, roleName)

    if (!existingRole) {
        throw new ConvexError(`Role named ${roleName} does not exist.`)
    }

    // Get existing role user for given user id
    const existingRoleUser = await getRoleUserByUserId(ctx, userId)

    // If role user record exists and the current role is different
    // from given role
    if (existingRoleUser && existingRoleUser.roleId !== existingRole._id) {
        // update role id of the role user record
        await ctx.db.patch(existingRoleUser._id, {
            roleId: existingRole._id
        })
    }

    // If role user record does not exist
    if (!existingRoleUser) {
        // insert a new role user record
        await ctx.db.insert('roleUsers', {
            roleId: existingRole._id,
            userId: userId
        });
    }
}
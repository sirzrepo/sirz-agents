import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { paginationOptsValidator, PaginationResult } from "convex/server";
import { Doc } from "../_generated/dataModel";
import { getResourceExistsMessage, getValidationMessage } from "../helpers";
import { getRoleById, getRoleByName, getRoleByUserId as getRoleByUserIdHelper, queryRolesList, updateRolePermissions } from "../helpers/rbac";

// Return a paginated roles list.
export const list = query({
    args: {
        userId: v.optional(v.id('users')),
        roleName: v.optional(v.string()),
        paginationOpts: paginationOptsValidator
    },
    handler: async (ctx, args): Promise<PaginationResult<Doc<'roles'>>> => {
        const { paginatedResults } = await queryRolesList(ctx, args);

        return paginatedResults!
    }
});

// Return all roles list.
export const listAll = query({
    args: {
        userId: v.optional(v.id('users')),
        roleName: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const { results } = await queryRolesList(ctx, args);

        return results!
    },
});

// Get role by user ID
export const getRoleByUserId = query({
    args: {
        userId: v.id('users')
    },
    handler: async (ctx, args) => {
        const role = await getRoleByUserIdHelper(ctx, args.userId);
        if (!role) {
            return null;
        }
        return role;
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        permissionNames: v.optional(v.array(v.string()))
    },
    handler: async (ctx, args): Promise<Doc<'roles'> | null> => {
        const { name, permissionNames } = args

        if (!name) {
            throw new ConvexError(getValidationMessage('Name'))
        }

        if (await getRoleByName(ctx, name)) {
            throw new ConvexError(getResourceExistsMessage('Role', name, 'name'))
        }

        const roleId = await ctx.db.insert("roles", {
            name
        });

        // If permission names are defined and have at least one
        // item.
        if (permissionNames && permissionNames.length > 0) {
            await updateRolePermissions(ctx, roleId, permissionNames)
        }

        return await getRoleById(ctx, roleId)
    },
});

// Get a single role.
export const get = query({
    args: {
        id: v.id('roles')
    },
    handler: async (ctx, args) => {
        const { id } = args

        return await getRoleById(ctx, id)
    },
});

// Update a role.
export const update = mutation({
    args: {
        id: v.id('roles'),
        name: v.optional(v.string()),
        permissionNames: v.optional(v.array(v.string()))
    },
    handler: async (ctx, args): Promise<Doc<"roles"> | null> => {
        const { id, name, permissionNames } = args

        // If permission names are defined and have at least one
        // item.
        if (permissionNames && permissionNames.length > 0) {
            await updateRolePermissions(ctx, id, permissionNames)
        }

        if (name) {
            const role = await getRoleByName(ctx, name)
            if (role && role._id !== id) {
                throw new ConvexError(getResourceExistsMessage('Role', name, 'name'))
            }

            await ctx.db.patch(id, {
                name
            });
        }

        return await getRoleById(ctx, id)
    },
});

// Deletes role with the given id
export const destroy = mutation({
    args: { id: v.id("roles") },
    handler: async (ctx, args) => {
        const { id } = args

        // Delete related permissions
        const permissionRoles = await ctx.db.query('permissionRoles')
            .withIndex('by_role', (q) => q.eq('roleId', id))
            .collect()

        const deleteRelatedPermissionsOperations = permissionRoles.map(item => {
            return ctx.db.delete(item._id)
        })

        if (deleteRelatedPermissionsOperations.length > 0) {
            await Promise.all(deleteRelatedPermissionsOperations)
        }

        // Delete role
        await ctx.db.delete(args.id);
    },
});
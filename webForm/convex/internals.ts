import { internalAction, internalMutation, internalQuery } from "./_generated/server"
import { getAuthenticatedUser, getUserByEmail, getUserById, PASSWORD_PROVIDER, syncRolesAndPermissions } from "./helpers"
import { internal } from "./_generated/api";
import { createAccount } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { getMissingRoleNames, getPermissionsByNames, insertRoles, linkUserRole, rolesPermissions, SUPER_ADMIN_ROLE } from "./helpers/rbac";
import { Doc } from "./_generated/dataModel";

export const addFirstUser = internalAction({
    handler: async (ctx): Promise<Doc<"users"> | null> => {
        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME } = process.env
        const provider = PASSWORD_PROVIDER
        const secret = ADMIN_PASSWORD ?? 'password'
        const name = ADMIN_NAME
        const email = ADMIN_EMAIL ?? 'admin@gmail.com'
        const username = ADMIN_USERNAME

        console.log('Checking if user exists...');
        const existingUser = await ctx.runQuery(internal.internals.getUser, {
            email
        })

        if (!existingUser) {
            console.log('User does not exist...');
            console.log('Adding user...');
            const created = await createAccount(ctx, {
                provider,
                account: { id: email, secret },
                profile: {
                    name,
                    email,
                    username,
                    affiliated: true,
                } as any,
                shouldLinkViaEmail: true,
                shouldLinkViaPhone: false,
            });

            const { user } = created;

            if (!user) {
                console.log('Something went wrong while adding user!')

                return null
            }
            console.log('User added!')

            console.log('Processing new user...')
            await ctx.runMutation(internal.internals.processNewUser, {
                userId: user._id,
                roleName: SUPER_ADMIN_ROLE,
                internal: true
            })

            console.log('User processed!')

            return user
        }


        console.log('User already exists!')
        console.log('All done...')
        return existingUser
    }
})

export const getUser = internalQuery({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) => {
        const { email } = args

        return await getUserByEmail(ctx, email)
    },
})

export const addRolesAndPermissions = internalMutation({
    handler: async (ctx) => {
        // Insert missing permissions
        const permissionsOperations = rolesPermissions
            .map(async (item) => {
                const { permissionNames } = item

                const existingPermissions = await getPermissionsByNames(ctx, permissionNames);

                const existingPermissionNames = existingPermissions.map(item => item.name)
                const missingPermissionNames = permissionNames.filter(item => !existingPermissionNames.includes(item))
                const insertMissingPermissions = missingPermissionNames.map((missingPermissionName) => {
                    return ctx.db.insert('permissions', {
                        name: missingPermissionName
                    })
                })

                return insertMissingPermissions
            }).flat()

        console.log('Checking for missing permissions...')
        if (permissionsOperations.length > 0) {
            console.log('Found some missing permissions...')
            console.log('Inserting them...')
            await Promise.all(permissionsOperations)
        } else {
            console.log('No missing permissions.')
        }

        // Insert missing roles
        const roleNames = rolesPermissions.map(item => item.roleName)
        const missingRoleNames = await getMissingRoleNames(ctx, roleNames)

        console.log('Checking for missing roles...')
        if (missingRoleNames.length > 0) {
            console.log('Found some missing roles...')
            console.log('Inserting them...')
            await insertRoles(ctx, missingRoleNames)
        } else {
            console.log('No missing roles.')
        }

        console.log('Syncing roles with their correspondign permissions...')
        await syncRolesAndPermissions(ctx, rolesPermissions)

        console.log('All done!')
    }
})

export const processNewUser = internalMutation({
    args: {
        userId: v.id('users'),
        roleName: v.string(),
        internal: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const { userId, internal, roleName } = args

        const mustBeAuthenticated = internal === undefined
            ? true
            : !internal

        if (!mustBeAuthenticated) {
            await linkUserRole(ctx, userId, roleName)
            return await getUserById(ctx, userId)
        }

        const authUser = await getAuthenticatedUser(ctx)

        if (!authUser) {
            throw new ConvexError("You are unauthenticated!")
        }

        if (roleName) {
            await linkUserRole(ctx, userId, roleName)
        }

        return await getUserById(ctx, userId)
    }
})

export const processExistingUser = internalMutation({
    args: {
        userId: v.id('users'),
        roleName: v.string(),
        internal: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const { userId, internal, roleName } = args

        const mustBeAuthenticated = internal === undefined
            ? true
            : !internal

        if (!mustBeAuthenticated) {
            await linkUserRole(ctx, userId, roleName)
            return await getUserById(ctx, userId)
        }

        const authUser = await getAuthenticatedUser(ctx)

        if (!authUser) {
            throw new ConvexError("You are unauthenticated!")
        }

        if (roleName) {
            await linkUserRole(ctx, userId, roleName)
        }

        return await getUserById(ctx, userId)
    }
})
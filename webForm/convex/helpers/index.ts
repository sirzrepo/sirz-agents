import { getAuthUserId } from "@convex-dev/auth/server";
import { MutationCtx, query, QueryCtx } from "../_generated/server";
import { getPermissionsByNames, getRolesByNames } from "./rbac";
import { Id } from "../_generated/dataModel";
import { ConvexError, v } from "convex/values";

export const PASSWORD_PROVIDER = 'password'

export const getUserByEmail = async (ctx: QueryCtx, email: string) => {
    return await ctx.db.query("users")
        .withIndex('email', (q) => q.eq("email", email))
        .unique();
}

type RatingDistribution = {
    [key: number]: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
};

export const syncRolesAndPermissions = async (ctx: MutationCtx, rolesPermissions: { roleName: string, permissionNames: string[] }[]) => {
    const roleNames = rolesPermissions.map(item => item.roleName)
    const permissionNames = rolesPermissions.map(item => {
        return item.permissionNames.map(permissionName => {
            return permissionName
        })
    }).flat();

    const roles = await getRolesByNames(ctx, roleNames)
    const permissions = await getPermissionsByNames(ctx, permissionNames)
    const permissionRoles = await ctx.db.query('permissionRoles').collect()

    const permissionRoleOperations = rolesPermissions.map(item => {
        const role = roles.find(role => role.name === item.roleName)

        if (role) {
            return item.permissionNames.map(permissionName => {
                const permission = permissions.find(permission => permission.name === permissionName)

                if (permission) {
                    const existingPermissionRole = permissionRoles.find(permissionRole => {
                        return permissionRole.permissionId === permission._id
                            && permissionRole.roleId === role._id
                    })

                    if (!existingPermissionRole) {
                        return ctx.db.insert('permissionRoles', {
                            roleId: role._id,
                            permissionId: permission?._id
                        })
                    }
                }
            })
        }
    }).flat().filter(item => item !== undefined)

    await Promise.all(permissionRoleOperations)
}

export const getResourceExistsMessage = (resource: string, label: string, labelType: string) => {
    return `${resource} with ${label} ${labelType} already exists`
}

export const getValidationMessage = (parameter: string, invalidState: string = 'empty') => {
    return `${parameter} parameter can not be ${invalidState}`
}

export const getAuthenticatedUser = async (ctx: QueryCtx | MutationCtx) => {
    const userId = await getAuthUserId(ctx);
    return userId !== null ? ctx.db.get(userId) : null;
}

export const getUserById = async (ctx: QueryCtx, id: Id<'users'>) => {
    return await ctx.db.get(id);
}

export const validateEmailAddress = async (ctx: MutationCtx, email: string) => {
    const emailUserExists = await getUserByEmail(ctx, email);

    if (emailUserExists) {
        throw new ConvexError('Email already exists!')
    }
}

export const updateAuthAccountProviderId = async (ctx: MutationCtx, userId: Id<'users'>, providerAccountId: string) => {
    const authAccount = await ctx.db.query('authAccounts')
        .withIndex('userIdAndProvider', (q) => q.eq('userId', userId).eq('provider', 'password'))
        .unique()

    if (authAccount) {
        return await ctx.db.patch(authAccount._id, {
            providerAccountId
        })
    }

    throw new ConvexError(`Auth account for user id ${userId}, not found.`)
}

export const getPageContentById = async (ctx: QueryCtx, id: Id<'pageContents'>) => {
    return await ctx.db.get(id);
}

export const getAuthenticationErrorMessage = () => {
    return "You are not authencated!"
}

export const getBlogById = async (ctx: QueryCtx, id: Id<'blogs'>) => {
    const blog = await ctx.db.get(id);

    if (!blog) {
        throw new ConvexError(getNotFoundErrorMessage('Blog'))
    }

    return {
        ...blog,
        featuredImageUrl: blog.featuredImage
            ? await ctx.storage.getUrl(blog.featuredImage)
            : ''
    }
}

export const getBlogBySlug = async (ctx: QueryCtx, slug: string) => {
    const blog = await ctx.db.query('blogs')
        .withIndex('by_slug', (q) => q.eq('slug', slug))
        .first();

    return {
        ...blog,
        featuredImageUrl: blog!.featuredImage
            ? await ctx.storage.getUrl(blog!.featuredImage)
            : ''
    }
}

export const getNotFoundErrorMessage = (resource: string) => {
    return `${resource} not found`
}

export const getAuthorizationErrorMessage = () => {
    return "You are not authorized!"
}

export const getImageUrl = async (ctx: QueryCtx, id: Id<'_storage'>) => {
    return await ctx.storage.getUrl(id);
}

export const makeSlug = (title: string) => {
    return title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')
}

export const getProductRatingStats = query({
    args: {
        productId: v.id('products'),
    },
    handler: async (ctx, args) => {
        const reviews = await ctx.db
            .query('productReviews')
            .withIndex('by_product_id', (q) => q.eq('productId', args.productId))
            .collect();

        if (reviews.length === 0) {
            return {
                average: 0,
                count: 0,
                distribution: {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                },
                hasReviews: false,
            };
        }


        // Calculate rating distribution
        const distribution = reviews.reduce<RatingDistribution>((acc, review) => {
            acc[review.rating] = (acc[review.rating] || 0) + 1;
            return acc;
        }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

        // Calculate weighted average (more weight to recent reviews)
        const now = Date.now();
        const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
        
        const { totalWeight, weightedSum, total } = reviews.reduce((acc, review) => {
            const age = now - (review.updatedAt || review.createdAt || now);
            // Recent reviews (last 30 days) get full weight, older ones get linearly less
            const weight = Math.max(0.5, 1 - (Math.max(0, age - THIRTY_DAYS) / (THIRTY_DAYS * 2)));
            
            return {
                totalWeight: acc.totalWeight + weight,
                weightedSum: acc.weightedSum + (review.rating * weight),
                total: acc.total + review.rating
            };
        }, { totalWeight: 0, weightedSum: 0, total: 0 });

        const average = total / reviews.length;
        const weightedAverage = weightedSum / totalWeight;

        // Blend weighted average with regular average (60/40 weight)
        const finalAverage = (weightedAverage * 0.6) + (average * 0.4);

        return {
            average: parseFloat(finalAverage.toFixed(2)),
            weightedAverage: parseFloat(weightedAverage.toFixed(2)),
            count: reviews.length,
            distribution,
            hasReviews: reviews.length > 0,
        };
    },
});
import { createAccount } from "@convex-dev/auth/server";
import { action, mutation, query } from "../_generated/server";
import { internal } from "../_generated/api";
import { getAuthenticatedUser, getUserById, PASSWORD_PROVIDER, updateAuthAccountProviderId, validateEmailAddress } from "../helpers";
import { ConvexError, v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { filter } from "convex-helpers/server/filter";
import { paginationOptsValidator } from "convex/server";
import { getRoleByUserId, linkUserRole } from "../helpers/rbac";

// Get the authenticated user
export const authenticated = query({
    args: {},
    handler: async (ctx) => {
        return await getAuthenticatedUser(ctx)
    },
});


// Add a user account.
export const addUserAccount = action({
    args: {
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        password: v.optional(v.string()),
        phone: v.optional(v.string()),
        emailVerificationTime: v.optional(v.number()),
        phoneVerificationTime: v.optional(v.number()),
        bio: v.optional(v.string()),
        confirmPassword: v.optional(v.string()),
        username: v.optional(v.string()),
        location: v.optional(v.string()),
        affiliated: v.optional(v.boolean()),
        roleName: v.optional(v.string()),
        internalRequest: v.optional(v.boolean())
    },
    handler: async (ctx, args): Promise<Doc<'users'> | null> => {
        const { name, email: rawEmail, password, confirmPassword, username, affiliated, roleName, internalRequest } = args
    
        if (!rawEmail) {
            throw new ConvexError("Email is required!");
        }
    
        const email = rawEmail.toLowerCase();
        const provider = PASSWORD_PROVIDER
        const secret = password

        if (secret === undefined) {
            throw new ConvexError("Password is required!");
        }

        if (password !== confirmPassword) {
            throw new ConvexError("Passwords do not match!");
        }

        const created = await createAccount(ctx, {
            provider,
            account: { id: email, secret },
            profile: {
                name,
                email,
                username,
                affiliated: affiliated ?? false,
                active: true,
            } as any,
            shouldLinkViaEmail: true,
            shouldLinkViaPhone: false,
        });

        const { user } = created;

        // If no role is specified, default to 'user' role
        const userRoleName = roleName || 'user';
        
        return await ctx.runMutation(internal.internals.processNewUser, {
            userId: user._id,
            roleName: userRoleName,
            internal: internalRequest ?? false
        })
    },
});

// Get a paginated users list.
export const list = query({
    args: {
        searchQuery: v.optional(v.string()),
        email: v.optional(v.string()),
        paginationOpts: paginationOptsValidator
    },
    handler: async (ctx, args) => {
        const { email, searchQuery, paginationOpts } = args

        const query = ctx.db.query('users')

        const results = await filter(
            query,
            (user) => {
                const emailCheck = email
                    ? user.email === email
                    : true
                const searchCheck = searchQuery
                    ? (user.email ? user.email.includes(searchQuery) : false)
                    || (user.name ? user.name.includes(searchQuery) : false)
                    || (user.phone ? user.phone.includes(searchQuery) : false)
                    : true

                return emailCheck && searchCheck;
            }
        )
            .order('desc')
            .paginate(paginationOpts)

        const transformations = await Promise.all(results.page.map(async (user) => {
            const role = await getRoleByUserId(ctx, user._id)
            return {
                roleName: role?.name,
                status: user.active ? "active" : "inactive",
                lastActive: 'Never',
                dateJoined: new Date(user._creationTime).toLocaleDateString(),
                image: user.image,
            }
        }))

        const transformedResults = {
            ...results,
            page: results.page.map((user, index) => ({
                ...user,
                ...transformations[index]
            }))
        }

        // console.log('transformations', transformations);
        // console.log('transformedResults', transformedResults);

        return transformedResults
    },
});

// Update a user.
export const update = mutation({
    args: {
        id: v.id('users'),
        email: v.optional(v.string()),
        roleName: v.optional(v.string()),
        username: v.optional(v.string()),
        name: v.optional(v.string()),
        affiliated: v.optional(v.boolean()),
        active: v.optional(v.boolean()),
        phone: v.optional(v.string()),
        bio: v.optional(v.string()),
        location: v.optional(v.string()),
        emailVerificationTime: v.optional(v.number()),
    },
    handler: async (ctx, args): Promise<Doc<"users"> | null> => {
        const { id, email, roleName, username, ...updates } = args

        // If role name is defined.
        if (roleName) {
            await linkUserRole(ctx, id, roleName)
        }

        // Get user to update.
        const user = await getUserById(ctx, id)

        if (!user) {
            throw new ConvexError("User not found.")
        }

        if (email && email !== user.email) {
            await validateEmailAddress(ctx, email)

            if (email !== user.email) {
                await updateAuthAccountProviderId(ctx, id, email)
            }
        }

        // Username can not be change once set.
        // if (username && user.username !== undefined && user.username !== username) {
        //     throw new ConvexError("Usernames can not be modified after they are set.")
        // }

        await ctx.db.patch(id, {
            email,
            username,
            ...updates
        })

        return await getUserById(ctx, id)
    },
});

export const deactivate = mutation({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        const { id } = args

        // Deactivate user.
        await ctx.db.patch(id, {
            active: false
        });
    },
});

// Update user profile information (all fields except email)
export const updateProfile = mutation({
    args: {
        id: v.id("users"),
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        phone: v.optional(v.string()),
        phoneVerificationTime: v.optional(v.number()),
        username: v.optional(v.string()),
        affiliated: v.optional(v.boolean()),
        active: v.optional(v.boolean()),
        businessName: v.optional(v.string()),
        type: v.optional(v.string()),
        bio: v.optional(v.string()),
        referralCode: v.optional(v.string()),
        verified: v.optional(v.boolean()),
        isActive: v.optional(v.boolean()),
        approvalStatus: v.optional(v.string()),
        documentDetails: v.optional(
            v.object({
                identityType: v.optional(v.string()),
                identityNumber: v.optional(v.string()),
                identityDocumentUrl: v.optional(v.string()),
                identityDocumentBackUrl: v.optional(v.string()),
                selfieDocumentUrl: v.optional(v.string()),
                businessLogoUrl: v.optional(v.string()),
            })
        ),
        bankDetails: v.optional(
            v.object({
                bankName: v.optional(v.string()),
                accountNumber: v.optional(v.string()),
                accountName: v.optional(v.string()),
                bvn: v.optional(v.string()),
            })
        ),
        address: v.optional(
            v.object({
                street: v.optional(v.string()),
                region: v.optional(v.string()),
                city: v.optional(v.string()),
                state: v.optional(v.string()),
                country: v.optional(v.string()),
                postalCode: v.optional(v.string()),
                contact: v.optional(v.string()),
                whatsapp: v.optional(v.string()),
            })
        ),
    },
    handler: async (ctx, args): Promise<Doc<"users"> | null> => {
        const { id, ...updates } = args;

        // Get user to update
        const user = await getUserById(ctx, id);
        if (!user) {
            throw new ConvexError("User not found.");
        }

        // Username cannot be changed once set
        if (updates.username && user.username !== undefined && updates.username !== user.username) {
            throw new ConvexError("Usernames cannot be modified after they are set.");
        }

        // Update the user with all provided fields
        await ctx.db.patch(id, updates);
        
        return await getUserById(ctx, id);
    },
});

// Update user's approval status
export const updateApprovalStatus = mutation({
    args: {
        id: v.id("users"),
        approvalStatus: v.union(
            v.literal("pending"),
            v.literal("approved"),
            v.literal("rejected"),
            v.literal("suspended")
        ),
        // Optional reason for the status change
        statusReason: v.optional(v.string()),
    },
    handler: async (ctx, args): Promise<Doc<"users">> => {
        const { id, approvalStatus, statusReason } = args;

        // Get user to update
        const user = await getUserById(ctx, id);
        if (!user) {
            throw new ConvexError("User not found.");
        }

        // Update the approval status and optional reason
        const updates: any = { approvalStatus };
        if (statusReason !== undefined) {
            updates.statusReason = statusReason;
        }

        await ctx.db.patch(id, updates);
        
        return (await getUserById(ctx, id))!;
    },
});

// Update user's profile image
export const updateProfileImage = mutation({
    args: {
        id: v.id("users"),
        imageUrl: v.string(),
    },
    handler: async (ctx, args): Promise<Doc<"users">> => {
        const { id, imageUrl } = args;

        // Get user to update
        const user = await getUserById(ctx, id);
        if (!user) {
            throw new ConvexError("User not found.");
        }

        // Update just the image URL
        await ctx.db.patch(id, { image: imageUrl });
        
        return (await getUserById(ctx, id))!;
    },
});

// Get a user by ID
export const getById = query({
    args: {
        id: v.id("users")
    },
    handler: async (ctx, args) => {
        return await getUserById(ctx, args.id);
    },
});

// Get multiple users by their IDs
export const getUsersByIds = query({
    args: {
        userIds: v.array(v.id("users"))
    },
    handler: async (ctx, args) => {
        const users = await Promise.all(
            args.userIds.map(userId => ctx.db.get(userId))
        );
        return users.filter(Boolean);
    },
});

// Get a user by email address
export const getUserByEmail = mutation({
    args: {
        email: v.string()
    },
    handler: async (ctx, args) => {
        const { email } = args;
        
        // Find the user with the given email
        const user = await ctx.db
            .query("users")
            .withIndex("email", q => q.eq("email", email))
            .first();
            
        return user;
    },
});

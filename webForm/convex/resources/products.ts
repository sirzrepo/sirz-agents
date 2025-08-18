import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { filter } from "convex-helpers/server/filter";
import { Doc } from "../_generated/dataModel";
import { getImageUrl, getNotFoundErrorMessage } from "../helpers";
import { ConvexError } from "convex/values";

type Product = Doc<"products">;

// Create a new product
export const create = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        price: v.string(),
        category: v.id("categories"),
        displayOrder: v.number(),
        available: v.boolean(),
        currency: v.string(),
        image: v.optional(v.id("_storage")),
        publicationStatus: v.optional(v.string()),
        type: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const { name, description, price, category, displayOrder, available, currency, image, publicationStatus, type } = args;

        return await ctx.db.insert("products", {
            name,
            description,
            price,
            category,
            displayOrder,
            available,
            currency,
            image,
            publicationStatus,
            type
        });
    },
});

// Get paginated list of products
export const list = query({
    args: {
        searchQuery: v.optional(v.string()),
        category: v.optional(v.string()),
        available: v.optional(v.boolean()),
        publicationStatus: v.optional(v.string()),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const { searchQuery, category, available, publicationStatus, paginationOpts } = args;

        const results = await filter(
            ctx.db.query("products"),
            (product: Product) => {
                const searchCheck = searchQuery ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
                const categoryCheck = category ? product.category === category : true;
                const availableCheck = available !== undefined ? product.available === available : true;
                const publicationStatusCheck = publicationStatus ? product.publicationStatus === publicationStatus : true;
                return searchCheck && categoryCheck && availableCheck && publicationStatusCheck;
            }
        )
            .withIndex("by_displayOrder")
            .order('asc')
            .paginate(paginationOpts);

        // Add image URLs to products
        const items = await Promise.all(
            results.page.map(async (product: Product) => {
                return {
                    ...product,
                    imageUrl: product.image ? await getImageUrl(ctx, product.image) : undefined
                }
            }
            )
        ).then(items => items.filter(item => item !== null));

        return {
            ...results,
            page: items
        };
        // return results;
    },
});

export const getProductByName = query({
    args: {
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const { name } = args;

        const product = await ctx.db.query("products")
            .withSearchIndex('search_name', (q) => q.search('name', name.replace('-', ' ')))
            .first()

        if (product) {
            // Add image URLs to products
            return {
                ...product,
                imageUrl: product.image ? await getImageUrl(ctx, product.image) : undefined
            }
        }

        return product;
    },
});

// Get a single product by ID
export const get = query({
    args: {
        id: v.id("products"),
    },
    handler: async (ctx, args) => {
        const { id } = args;
        const product = await ctx.db.get(id);

        if (!product) {
            throw new ConvexError(getNotFoundErrorMessage('product'));
        }

        return {
            ...product,
            imageUrl: product.image ? await getImageUrl(ctx, product.image) : undefined
        }
    },
});

// Update a product
export const update = mutation({
    args: {
        id: v.id("products"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.string()),
        category: v.id("categories"),
        displayOrder: v.optional(v.number()),
        available: v.optional(v.boolean()),
        currency: v.optional(v.string()),
        image: v.optional(v.id("_storage")),
        publicationStatus: v.optional(v.string()),
        type: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        return await ctx.db.patch(id, fields);
    },
});


// // Update product image
// export const updateImage = mutation({
//     args: {
//         id: v.id("products"),
//         image: v.id("_storage"),
//     },
//     handler: async (ctx, args) => {
//         const { id, image } = args;
//         return await ctx.db.patch(id, { image });
//     },
// });

// Delete a product
export const remove = mutation({
    args: {
        id: v.id("products"),
    },
    handler: async (ctx, args) => {
        const { id } = args;
        return await ctx.db.delete(id);
    },
}); 
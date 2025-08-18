import { defineTable } from "convex/server";
import { v } from "convex/values";

export default defineTable({
    name: v.string(),
    description: v.string(),
    price: v.string(),
    category: v.id("categories"),
    available: v.boolean(),
    displayOrder: v.optional(v.number()),
    currency: v.string(),
    image: v.optional(v.id("_storage")),
    publicationStatus: v.optional(v.string()),
    type: v.optional(v.string())
})
    .index('by_name', ['name'])
    .index('by_category', ['category'])
    .index('by_available', ['available'])
    .index('by_displayOrder', ['displayOrder'])
    .index('by_publicationStatus', ['publicationStatus'])
    .searchIndex('search_name', {
        searchField: 'name'
    })
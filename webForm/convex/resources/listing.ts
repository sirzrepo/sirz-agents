import { mutation, query } from "../_generated/server";
import { ConvexError, v } from "convex/values";
import {
  getAuthenticatedUser,
  getAuthenticationErrorMessage,
  getNotFoundErrorMessage,
} from "../helpers";
import { filter } from "convex-helpers/server/filter";
import { paginationOptsValidator } from "convex/server";

// Create a new listing
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    keyFeatures: v.optional(v.array(v.string())),
    images: v.array(v.string()),
    category: v.string(),
    subcategory: v.string(),
    condition: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    isNegotiable: v.boolean(),
    branchId: v.optional(v.id("branch")),
    merchantId: v.id("users"),
    isBooked: v.optional(v.boolean()),
    isSold: v.optional(v.boolean()),
    bookingFee: v.optional(v.number()),
    deliveryFee: v.optional(v.number()),
    deliveryMethod: v.optional(v.array(v.string())),
    deliveryNote: v.optional(v.string()),
    quantity: v.optional(v.number()),
    autoAcceptBookings: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    discount: v.optional(v.number()),
    status: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    contact: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
    
    address: v.optional(v.object({
      street: v.optional(v.string()),
      region: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      country: v.optional(v.string()),
      postalCode: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    const listingId = await ctx.db.insert("listing", {
      ...args,
      merchantId: user._id,
      status: args.status || "active",
      isBooked: args.isBooked || false,
      isSold: args.isSold || false,
      featured: args.featured || false,
      price: args.price,
      subcategory: args.subcategory,
    });
    
    return await ctx.db.get(listingId);
  },
});

// List all listings with filters
export const list = query({
  args: {
    searchQuery: v.optional(v.string()),
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    condition: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    isNegotiable: v.optional(v.boolean()),
    isBooked: v.optional(v.boolean()),
    isSold: v.optional(v.boolean()),
    branchId: v.optional(v.id("branch")),
    merchantId: v.optional(v.id("users")),
    featured: v.optional(v.boolean()),
    region: v.optional(v.string()),
    state: v.optional(v.string()),
    country: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("listing");
    
    // Apply filters
    query = filter(query, (listing) => {
      const searchCheck = args.searchQuery 
        ? listing.title.toLowerCase().includes(args.searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(args.searchQuery.toLowerCase())
        : true;
      
      const categoryCheck = args.category ? listing.category === args.category : true;
      const subcategoryCheck = args.subcategory ? listing.subcategory === args.subcategory : true;
      const conditionCheck = args.condition ? listing.condition === args.condition : true;
      const minPriceCheck = args.minPrice ? listing.price >= args.minPrice : true;
      const maxPriceCheck = args.maxPrice ? listing.price <= args.maxPrice : true;
      const negotiableCheck = typeof args.isNegotiable !== 'undefined' 
        ? listing.isNegotiable === args.isNegotiable 
        : true;
      const bookedCheck = typeof args.isBooked !== 'undefined' 
        ? listing.isBooked === args.isBooked 
        : true;
      const soldCheck = typeof args.isSold !== 'undefined' 
        ? listing.isSold === args.isSold 
        : true;
      // const branchCheck = args.branchId ? listing.branchId === args.branchId : true;
      const merchantCheck = args.merchantId ? listing.merchantId === args.merchantId : true;
      const featuredCheck = typeof args.featured !== 'undefined' 
        ? listing.featured === args.featured 
        : true;
      const regionCheck = args.region ? listing.address?.region === args.region : true;
      const stateCheck = args.state ? listing.address?.state === args.state : true;
      const countryCheck = args.country ? listing.address?.country === args.country : true;

      return searchCheck && categoryCheck && subcategoryCheck && conditionCheck && 
             minPriceCheck && maxPriceCheck && negotiableCheck && 
             bookedCheck && soldCheck && merchantCheck && 
             featuredCheck && regionCheck && stateCheck && countryCheck;
    });

    return await query.order("desc").paginate(args.paginationOpts);
  },
});

// Get a single listing by ID
export const get = query({
  args: { id: v.id("listing") },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.id);
    if (!listing) throw new ConvexError(getNotFoundErrorMessage("Listing"));
    return listing;
  },
});

// Update a listing
export const update = mutation({
  args: {
    id: v.id("listing"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    keyFeatures: v.optional(v.array(v.string())),
    images: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    condition: v.optional(v.string()),
    price: v.optional(v.number()),
    originalPrice: v.optional(v.number()),
    isNegotiable: v.optional(v.boolean()),
    isBooked: v.optional(v.boolean()),
    isSold: v.optional(v.boolean()),
    bookingFee: v.optional(v.number()),
    deliveryFee: v.optional(v.number()),
    deliveryMethod: v.optional(v.array(v.string())),
    deliveryNote: v.optional(v.string()),
    quantity: v.optional(v.number()),
    autoAcceptBookings: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    discount: v.optional(v.number()),
    status: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    contact: v.optional(v.string()),

    address: v.optional(v.object({
      street: v.optional(v.string()),
      region: v.optional(v.string()),
      city: v.optional(v.string()),
      state: v.optional(v.string()),
      country: v.optional(v.string()),
      postalCode: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    const { id, ...updates } = args;
    const listing = await ctx.db.get(id);
    
    if (!listing) throw new ConvexError(getNotFoundErrorMessage("Listing"));
    
    // Only the merchant who created the listing or an admin can update it
    if (listing.merchantId !== user._id) {
        // if (listing.merchantId !== user._id && user.role !== 'admin') {
      throw new ConvexError("You don't have permission to update this listing");
    }

    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});

// Delete a listing
export const remove = mutation({
  args: { id: v.id("listing") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    const listing = await ctx.db.get(args.id);
    if (!listing) throw new ConvexError(getNotFoundErrorMessage("Listing"));

    // Only the merchant who created the listing or an admin can delete it
    if (listing.merchantId !== user._id ) {
        // if (listing.merchantId !== user._id && user.role !== 'admin') {
      throw new ConvexError("You don't have permission to delete this listing");
    }

    await ctx.db.delete(args.id);
  },
});

// Get multiple listings by their IDs
export const getListingsByIds = query({
  args: {
    listingIds: v.array(v.id("listing"))
  },
  handler: async (ctx, args) => {
    const listings = await Promise.all(
      args.listingIds.map(id => ctx.db.get(id))
    );
    return listings.filter(Boolean);
  },
});

// Get listings by merchant
export const getByMerchant = query({
  args: { 
    merchantId: v.id("users"),
    status: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("listing").withIndex("by_merchantId", q =>
      q.eq("merchantId", args.merchantId)
    );

    if (args.status) {
      query = filter(query, (listing) => listing.status === args.status);
    }

    return await query.order("desc").paginate(args.paginationOpts);
  },
});

// Get featured listings
export const getFeatured = query({
  args: { 
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("listing")
      .withIndex("by_featured", q => q.eq("featured", true))
      .filter(q => q.eq(q.field("isSold"), false));
    
    if (args.category) {
      query = query.filter(q => q.eq(q.field("category"), args.category));
    }
    
    const results = await query.order("desc").take(args.limit || 10);
    return results;
  },
});

// Search listings with full-text search
export const search = query({
  args: {
    query: v.string(),
    category: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    condition: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // Simple search implementation - for production, consider using a search index
    let query = ctx.db.query("listing");
    
    const searchTerms = args.query.toLowerCase().split(' ').filter(term => term.length > 2);
    
    query = filter(query, (listing) => {
      const titleMatch = searchTerms.some(term => 
        listing.title.toLowerCase().includes(term)
      );
      
      const descMatch = searchTerms.some(term => 
        listing.description.toLowerCase().includes(term)
      );
      
      const categoryMatch = args.category 
        ? listing.category === args.category 
        : true;
        
      const priceMatch = (args.minPrice || args.maxPrice) ? 
        (!args.minPrice || listing.price >= args.minPrice) && 
        (!args.maxPrice || listing.price <= args.maxPrice)
        : true;
        
      const conditionMatch = args.condition 
        ? listing.condition === args.condition 
        : true;
      
      return (titleMatch || descMatch) && categoryMatch && priceMatch && conditionMatch;
    });
    
    return await query.order("desc").paginate(args.paginationOpts);
  },
});


// Get active listings with filters
export const listActive = query({
  args: {
    searchQuery: v.optional(v.string()),
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    condition: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    isNegotiable: v.optional(v.boolean()),
    isBooked: v.optional(v.boolean()),
    isSold: v.optional(v.boolean()),
    branchId: v.optional(v.id("branch")),
    merchantId: v.optional(v.id("users")),
    featured: v.optional(v.boolean()),
    region: v.optional(v.string()),
    state: v.optional(v.string()),
    country: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("listing");
    
    // Apply filters
    query = filter(query, (listing) => {
      const searchCheck = args.searchQuery 
        ? listing.title.toLowerCase().includes(args.searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(args.searchQuery.toLowerCase())
        : true;
      
      const categoryCheck = args.category ? listing.category === args.category : true;
      const subcategoryCheck = args.subcategory ? listing.subcategory === args.subcategory : true;
      const conditionCheck = args.condition ? listing.condition === args.condition : true;
      const minPriceCheck = args.minPrice ? listing.price >= args.minPrice : true;
      const maxPriceCheck = args.maxPrice ? listing.price <= args.maxPrice : true;
      const negotiableCheck = typeof args.isNegotiable !== 'undefined' 
        ? listing.isNegotiable === args.isNegotiable 
        : true;
      const bookedCheck = typeof args.isBooked !== 'undefined' 
        ? listing.isBooked === args.isBooked 
        : true;
      const soldCheck = typeof args.isSold !== 'undefined' 
        ? listing.isSold === args.isSold 
        : true;
      const merchantCheck = args.merchantId ? listing.merchantId === args.merchantId : true;
      const featuredCheck = typeof args.featured !== 'undefined' 
        ? listing.featured === args.featured 
        : true;
      const regionCheck = args.region ? listing.address?.region === args.region : true;
      const stateCheck = args.state ? listing.address?.state === args.state : true;
      const countryCheck = args.country ? listing.address?.country === args.country : true;
      const statusCheck = listing.status === 'active';

      return searchCheck && categoryCheck && subcategoryCheck && conditionCheck && 
             minPriceCheck && maxPriceCheck && negotiableCheck && 
             bookedCheck && soldCheck && merchantCheck && featuredCheck && regionCheck && 
             stateCheck && countryCheck && statusCheck;
    });

    return await query.order("desc").paginate(args.paginationOpts);
  },
});

// Update listing status
// Valid statuses: 'active', 'sold', 'pending', 'rejected'
export const updateStatus = mutation({
  args: {
    id: v.id("listing"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError(getAuthenticationErrorMessage());

    // Validate status
    const validStatuses = ['active', 'inactive', 'sold', 'pending', 'rejected'];
    if (!validStatuses.includes(args.status)) {
      throw new ConvexError('Invalid status. Must be one of: ' + validStatuses.join(', '));
    }

    const listing = await ctx.db.get(args.id);
    if (!listing) throw new ConvexError(getNotFoundErrorMessage("Listing"));

    // Verify the user is the owner of the listing
    if (listing.merchantId !== user._id) {
      throw new ConvexError('You do not have permission to update this listing');
    }

    await ctx.db.patch(args.id, { 
      status: args.status,
    });
    
    return await ctx.db.get(args.id);
  },
});


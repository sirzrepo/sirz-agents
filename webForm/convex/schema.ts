import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import users from "./tables/users";
import roles from "./tables/roles";
import permissions from "./tables/permissions";
import permissionRoles from "./tables/permissionRoles";
import roleUsers from "./tables/roleUsers";
import accessLogs from "./tables/accessLogs";
import blogComments from "./tables/blogComments";
import blogs from "./tables/blogs";
import bookings from "./tables/bookings";
import developers from "./tables/developers";
import eventAttendees from "./tables/eventAttendees";
import events from "./tables/events";
import eventSpeakers from "./tables/eventSpeakers";
import faqs from "./tables/faqs";
import jobApplicants from "./tables/jobApplicants";
import pageContents from "./tables/pageContents";
import jobs from "./tables/jobs";
import products from "./tables/products";
import services from "./tables/services";
import testimonials from "./tables/testimonials";
import media from "./tables/media";
import departments from "./tables/departments";
import contactMessages from "./tables/contactMessages";
import distributors from "./tables/distributors";
import orders from "./tables/orders";
import newsLetter from "./tables/newsLetter";
import branch from "./tables/branch";
import productInventory from "./tables/productInventory";
import salesReport from "./tables/salesReport";
import dailyInventory from "./tables/dailyInventory";
import notifications from "./tables/notifications";
import address from "./tables/address";
import discount from "./tables/discount";
import cashbacks from "./tables/cashbacks";
import cashbackRecords from "./tables/cashbackRecords";
import wishlists from "./tables/wishlists";
import categories from "./tables/categories";
import productReviews from "./tables/productReviews";
import listing from "./tables/listing";
import merchant from "./tables/merchant";
import itemViews from "./tables/itemViews";
import likes from "./tables/likes";

import userPresence from "./tables/userPresence";
import messageRead from "./tables/messageRead";
import conversations from "./tables/conversations";
import message from "./tables/message";
import deviceFingerPrint from "./tables/deviceFingerPrint";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  users,
  roles,
  permissions,
  permissionRoles,
  roleUsers,
  accessLogs,
  blogComments,
  blogs,
  bookings,
  developers,
  eventAttendees,
  events,
  eventSpeakers,
  faqs,
  jobApplicants,
  jobs,
  pageContents,
  products,
  services,
  testimonials,
  media,
  departments,
  distributors,
  orders,
  contactMessages,
  newsLetter,
  branch,
  productInventory,
  salesReport,
  dailyInventory,
  notifications,
  address,
  discount,
  cashbacks,
  cashbackRecords,
  wishlists,
  categories,
  productReviews,
  listing,
  merchant,
  itemViews,
  likes,
  userPresence,
  messageRead,
  conversations,
  message,
  deviceFingerPrint,
  messages: defineTable({
    userId: v.id("users"),
    body: v.string(),
  }),
});

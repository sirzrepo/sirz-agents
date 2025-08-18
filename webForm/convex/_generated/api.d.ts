/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as chat_conversations from "../chat/conversations.js";
import type * as chat_index from "../chat/index.js";
import type * as chat_messages from "../chat/messages.js";
import type * as chat_presence from "../chat/presence.js";
import type * as errors from "../errors.js";
import type * as helpers_generateEmail from "../helpers/generateEmail.js";
import type * as helpers_index from "../helpers/index.js";
import type * as helpers_rbac from "../helpers/rbac.js";
import type * as http from "../http.js";
import type * as internals from "../internals.js";
import type * as messages from "../messages.js";
import type * as orders from "../orders.js";
import type * as otp_ResendOTP from "../otp/ResendOTP.js";
import type * as otp_VerificationCodeEmail from "../otp/VerificationCodeEmail.js";
import type * as passwordReset_PasswordResetEmail from "../passwordReset/PasswordResetEmail.js";
import type * as passwordReset_ResendOTPPasswordReset from "../passwordReset/ResendOTPPasswordReset.js";
import type * as resources_accessLogs from "../resources/accessLogs.js";
import type * as resources_address from "../resources/address.js";
import type * as resources_blogComments from "../resources/blogComments.js";
import type * as resources_blogs from "../resources/blogs.js";
import type * as resources_bookings from "../resources/bookings.js";
import type * as resources_branch from "../resources/branch.js";
import type * as resources_cashbacks from "../resources/cashbacks.js";
import type * as resources_categories from "../resources/categories.js";
import type * as resources_contactMessages from "../resources/contactMessages.js";
import type * as resources_dailyInventory from "../resources/dailyInventory.js";
import type * as resources_departments from "../resources/departments.js";
import type * as resources_deviceFingerPrint from "../resources/deviceFingerPrint.js";
import type * as resources_discount from "../resources/discount.js";
import type * as resources_distributors from "../resources/distributors.js";
import type * as resources_eventAttendees from "../resources/eventAttendees.js";
import type * as resources_eventSpeakers from "../resources/eventSpeakers.js";
import type * as resources_events from "../resources/events.js";
import type * as resources_faqs from "../resources/faqs.js";
import type * as resources_itemViews from "../resources/itemViews.js";
import type * as resources_jobApplicants from "../resources/jobApplicants.js";
import type * as resources_jobs from "../resources/jobs.js";
import type * as resources_likes from "../resources/likes.js";
import type * as resources_listing from "../resources/listing.js";
import type * as resources_media from "../resources/media.js";
import type * as resources_merchant from "../resources/merchant.js";
import type * as resources_newsLetter from "../resources/newsLetter.js";
import type * as resources_notifications from "../resources/notifications.js";
import type * as resources_orders from "../resources/orders.js";
import type * as resources_pageContents from "../resources/pageContents.js";
import type * as resources_permissions from "../resources/permissions.js";
import type * as resources_productInventory from "../resources/productInventory.js";
import type * as resources_productReviews from "../resources/productReviews.js";
import type * as resources_products from "../resources/products.js";
import type * as resources_roles from "../resources/roles.js";
import type * as resources_salesReport from "../resources/salesReport.js";
import type * as resources_services from "../resources/services.js";
import type * as resources_testimonials from "../resources/testimonials.js";
import type * as resources_users from "../resources/users.js";
import type * as resources_wishlists from "../resources/wishlists.js";
import type * as storage from "../storage.js";
import type * as tables_accessLogs from "../tables/accessLogs.js";
import type * as tables_address from "../tables/address.js";
import type * as tables_blogComments from "../tables/blogComments.js";
import type * as tables_blogs from "../tables/blogs.js";
import type * as tables_bookings from "../tables/bookings.js";
import type * as tables_branch from "../tables/branch.js";
import type * as tables_cashbackRecords from "../tables/cashbackRecords.js";
import type * as tables_cashbacks from "../tables/cashbacks.js";
import type * as tables_categories from "../tables/categories.js";
import type * as tables_contactMessages from "../tables/contactMessages.js";
import type * as tables_conversations from "../tables/conversations.js";
import type * as tables_dailyInventory from "../tables/dailyInventory.js";
import type * as tables_departments from "../tables/departments.js";
import type * as tables_developers from "../tables/developers.js";
import type * as tables_deviceFingerPrint from "../tables/deviceFingerPrint.js";
import type * as tables_discount from "../tables/discount.js";
import type * as tables_distributors from "../tables/distributors.js";
import type * as tables_eventAttendees from "../tables/eventAttendees.js";
import type * as tables_eventSpeakers from "../tables/eventSpeakers.js";
import type * as tables_events from "../tables/events.js";
import type * as tables_faqs from "../tables/faqs.js";
import type * as tables_itemViews from "../tables/itemViews.js";
import type * as tables_jobApplicants from "../tables/jobApplicants.js";
import type * as tables_jobs from "../tables/jobs.js";
import type * as tables_likes from "../tables/likes.js";
import type * as tables_listing from "../tables/listing.js";
import type * as tables_media from "../tables/media.js";
import type * as tables_merchant from "../tables/merchant.js";
import type * as tables_message from "../tables/message.js";
import type * as tables_messageRead from "../tables/messageRead.js";
import type * as tables_newsLetter from "../tables/newsLetter.js";
import type * as tables_notifications from "../tables/notifications.js";
import type * as tables_orders from "../tables/orders.js";
import type * as tables_pageContents from "../tables/pageContents.js";
import type * as tables_permissionRoles from "../tables/permissionRoles.js";
import type * as tables_permissions from "../tables/permissions.js";
import type * as tables_productInventory from "../tables/productInventory.js";
import type * as tables_productReviews from "../tables/productReviews.js";
import type * as tables_products from "../tables/products.js";
import type * as tables_roleUsers from "../tables/roleUsers.js";
import type * as tables_roles from "../tables/roles.js";
import type * as tables_salesReport from "../tables/salesReport.js";
import type * as tables_services from "../tables/services.js";
import type * as tables_testimonials from "../tables/testimonials.js";
import type * as tables_userPresence from "../tables/userPresence.js";
import type * as tables_users from "../tables/users.js";
import type * as tables_wishlists from "../tables/wishlists.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "chat/conversations": typeof chat_conversations;
  "chat/index": typeof chat_index;
  "chat/messages": typeof chat_messages;
  "chat/presence": typeof chat_presence;
  errors: typeof errors;
  "helpers/generateEmail": typeof helpers_generateEmail;
  "helpers/index": typeof helpers_index;
  "helpers/rbac": typeof helpers_rbac;
  http: typeof http;
  internals: typeof internals;
  messages: typeof messages;
  orders: typeof orders;
  "otp/ResendOTP": typeof otp_ResendOTP;
  "otp/VerificationCodeEmail": typeof otp_VerificationCodeEmail;
  "passwordReset/PasswordResetEmail": typeof passwordReset_PasswordResetEmail;
  "passwordReset/ResendOTPPasswordReset": typeof passwordReset_ResendOTPPasswordReset;
  "resources/accessLogs": typeof resources_accessLogs;
  "resources/address": typeof resources_address;
  "resources/blogComments": typeof resources_blogComments;
  "resources/blogs": typeof resources_blogs;
  "resources/bookings": typeof resources_bookings;
  "resources/branch": typeof resources_branch;
  "resources/cashbacks": typeof resources_cashbacks;
  "resources/categories": typeof resources_categories;
  "resources/contactMessages": typeof resources_contactMessages;
  "resources/dailyInventory": typeof resources_dailyInventory;
  "resources/departments": typeof resources_departments;
  "resources/deviceFingerPrint": typeof resources_deviceFingerPrint;
  "resources/discount": typeof resources_discount;
  "resources/distributors": typeof resources_distributors;
  "resources/eventAttendees": typeof resources_eventAttendees;
  "resources/eventSpeakers": typeof resources_eventSpeakers;
  "resources/events": typeof resources_events;
  "resources/faqs": typeof resources_faqs;
  "resources/itemViews": typeof resources_itemViews;
  "resources/jobApplicants": typeof resources_jobApplicants;
  "resources/jobs": typeof resources_jobs;
  "resources/likes": typeof resources_likes;
  "resources/listing": typeof resources_listing;
  "resources/media": typeof resources_media;
  "resources/merchant": typeof resources_merchant;
  "resources/newsLetter": typeof resources_newsLetter;
  "resources/notifications": typeof resources_notifications;
  "resources/orders": typeof resources_orders;
  "resources/pageContents": typeof resources_pageContents;
  "resources/permissions": typeof resources_permissions;
  "resources/productInventory": typeof resources_productInventory;
  "resources/productReviews": typeof resources_productReviews;
  "resources/products": typeof resources_products;
  "resources/roles": typeof resources_roles;
  "resources/salesReport": typeof resources_salesReport;
  "resources/services": typeof resources_services;
  "resources/testimonials": typeof resources_testimonials;
  "resources/users": typeof resources_users;
  "resources/wishlists": typeof resources_wishlists;
  storage: typeof storage;
  "tables/accessLogs": typeof tables_accessLogs;
  "tables/address": typeof tables_address;
  "tables/blogComments": typeof tables_blogComments;
  "tables/blogs": typeof tables_blogs;
  "tables/bookings": typeof tables_bookings;
  "tables/branch": typeof tables_branch;
  "tables/cashbackRecords": typeof tables_cashbackRecords;
  "tables/cashbacks": typeof tables_cashbacks;
  "tables/categories": typeof tables_categories;
  "tables/contactMessages": typeof tables_contactMessages;
  "tables/conversations": typeof tables_conversations;
  "tables/dailyInventory": typeof tables_dailyInventory;
  "tables/departments": typeof tables_departments;
  "tables/developers": typeof tables_developers;
  "tables/deviceFingerPrint": typeof tables_deviceFingerPrint;
  "tables/discount": typeof tables_discount;
  "tables/distributors": typeof tables_distributors;
  "tables/eventAttendees": typeof tables_eventAttendees;
  "tables/eventSpeakers": typeof tables_eventSpeakers;
  "tables/events": typeof tables_events;
  "tables/faqs": typeof tables_faqs;
  "tables/itemViews": typeof tables_itemViews;
  "tables/jobApplicants": typeof tables_jobApplicants;
  "tables/jobs": typeof tables_jobs;
  "tables/likes": typeof tables_likes;
  "tables/listing": typeof tables_listing;
  "tables/media": typeof tables_media;
  "tables/merchant": typeof tables_merchant;
  "tables/message": typeof tables_message;
  "tables/messageRead": typeof tables_messageRead;
  "tables/newsLetter": typeof tables_newsLetter;
  "tables/notifications": typeof tables_notifications;
  "tables/orders": typeof tables_orders;
  "tables/pageContents": typeof tables_pageContents;
  "tables/permissionRoles": typeof tables_permissionRoles;
  "tables/permissions": typeof tables_permissions;
  "tables/productInventory": typeof tables_productInventory;
  "tables/productReviews": typeof tables_productReviews;
  "tables/products": typeof tables_products;
  "tables/roleUsers": typeof tables_roleUsers;
  "tables/roles": typeof tables_roles;
  "tables/salesReport": typeof tables_salesReport;
  "tables/services": typeof tables_services;
  "tables/testimonials": typeof tables_testimonials;
  "tables/userPresence": typeof tables_userPresence;
  "tables/users": typeof tables_users;
  "tables/wishlists": typeof tables_wishlists;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

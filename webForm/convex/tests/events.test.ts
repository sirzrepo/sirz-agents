// import { convexTest } from "convex-test";
// import { expect, test } from "vitest";
// import schema from "../schema";
// import { api, internal } from "../_generated/api";
// import { Id } from "../_generated/dataModel";

// const createTestEvent = async (t: any, overrides = {}) => {
//     // First create a user for the description field
//     const user = await t.action(internal.internals.addFirstUser, {});
//     // const users = await t.query(api.resources.users.list, {
//     //     paginationOpts: { numItems: 1, cursor: null }
//     // });
//     // const userId = users.page.at(0)?._id as Id<"users">;    

//     // Create a storage ID for thumbnail
//     // const storageId = "test_storage_id" as Id<"_storage">;

//     const defaultEvent = {
//         title: "Test Event",
//         description: "Test Description",
//         dateTime: "2024-03-20T10:00:00Z",
//         venue: "Test Venue",
//         venueType: "Physical",
//         eventType: "Conference",
//         createdBy: user._id,
//         // thumbnail: storageId,
//     };

//     return await t.mutation(api.resources.events.create, {
//         ...defaultEvent,
//         ...overrides
//     });
// };

// test("Create event with all fields", async () => {
//     const t = convexTest(schema);
//     const eventId = await createTestEvent(t);
//     expect(eventId).toBeDefined();

//     const event = await t.query(api.resources.events.get, { id: eventId });
//     expect(event).toMatchObject({
//         title: "Test Event",
//         venue: "Test Venue",
//         venueType: "Physical",
//         eventType: "Conference",
//     });
// });

// test("List events with pagination", async () => {
//     const t = convexTest(schema);
//     await createTestEvent(t, { title: "Event 1" });
//     await createTestEvent(t, { title: "Event 2" });

//     const result = await t.query(api.resources.events.list, {
//         paginationOpts: { numItems: 1, cursor: null }
//     });

//     expect(result.page).toHaveLength(1);
//     expect(result.isDone).toBe(false);
// });

// test("Filter events by various fields", async () => {
//     const t = convexTest(schema);
//     await createTestEvent(t, {
//         title: "Conference A",
//         venue: "Venue A",
//         venueType: "Physical",
//         eventType: "Conference"
//     });
//     await createTestEvent(t, {
//         title: "Workshop B",
//         venue: "Venue B",
//         venueType: "Virtual",
//         eventType: "Workshop"
//     });

//     // Test title filter
//     const titleResult = await t.query(api.resources.events.list, {
//         title: "Conference A",
//         paginationOpts: { numItems: 10, cursor: null }
//     });
//     expect(titleResult.page).toHaveLength(1);
//     expect(titleResult.page[0].title).toBe("Conference A");

//     // Test venue filter
//     const venueResult = await t.query(api.resources.events.list, {
//         venue: "Venue B",
//         paginationOpts: { numItems: 10, cursor: null }
//     });
//     expect(venueResult.page).toHaveLength(1);
//     expect(venueResult.page[0].venue).toBe("Venue B");

//     // Test venueType filter
//     const venueTypeResult = await t.query(api.resources.events.list, {
//         venueType: "Virtual",
//         paginationOpts: { numItems: 10, cursor: null }
//     });
//     expect(venueTypeResult.page).toHaveLength(1);
//     expect(venueTypeResult.page[0].venueType).toBe("Virtual");

//     // Test eventType filter
//     const eventTypeResult = await t.query(api.resources.events.list, {
//         eventType: "Workshop",
//         paginationOpts: { numItems: 10, cursor: null }
//     });
//     expect(eventTypeResult.page).toHaveLength(1);
//     expect(eventTypeResult.page[0].eventType).toBe("Workshop");
// });

// test("Update event", async () => {
//     const t = convexTest(schema);
//     const eventId = await createTestEvent(t);

//     const updates = {
//         title: "Updated Event",
//         venue: "New Venue",
//     };

//     const updatedEvent = await t.mutation(api.resources.events.update, {
//         id: eventId,
//         ...updates
//     });

//     expect(updatedEvent).toMatchObject(updates);
// });

// test("Update event with partial fields", async () => {
//     const t = convexTest(schema);
//     const eventId = await createTestEvent(t);
//     const originalEvent = await t.query(api.resources.events.get, { id: eventId });

//     const updatedEvent = await t.mutation(api.resources.events.update, {
//         id: eventId,
//         title: "Only Title Updated"
//     });

//     expect(updatedEvent?.title).toBe("Only Title Updated");
//     expect(updatedEvent?.venue).toBe(originalEvent?.venue);
//     expect(updatedEvent?.eventType).toBe(originalEvent?.eventType);
// });

// test("Delete event", async () => {
//     const t = convexTest(schema);
//     const eventId = await createTestEvent(t);

//     const deletedEvent = await t.mutation(api.resources.events.remove, { id: eventId });
//     expect(deletedEvent).toBeDefined();

//     const fetchedEvent = await t.query(api.resources.events.get, { id: eventId });
//     expect(fetchedEvent).toBeNull();
// });

// test("Get non-existent event", async () => {
//     const t = convexTest(schema);
//     const nonExistentId = "123" as Id<"events">;

//     void expect(async () => {
//         await t.query(api.resources.events.get, { id: nonExistentId });
//     }).rejects.toThrowError('Expected ID');
// }); 
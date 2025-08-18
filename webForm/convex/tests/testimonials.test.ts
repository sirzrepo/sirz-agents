// import { convexTest } from "convex-test";
// import { expect, test } from "vitest";
// import schema from "../schema";
// import { api } from "../_generated/api";
// import { Id } from "../_generated/dataModel";

// const createTestTestimonial = async (t: any, overrides = {}) => {
//     const defaultTestimonial = {
//         name: "John Doe",
//         testimony: "Great service!",
//         status: "pending",
//         reviewDate: new Date().toISOString(),
//     };
//     return await t.mutation(api.resources.testimonials.create, {
//         ...defaultTestimonial,
//         ...overrides
//     });
// };

// test("Create testimonial with default fields", async () => {
//     const t = convexTest(schema);
//     const testimonialId = await createTestTestimonial(t);
//     expect(testimonialId).toBeDefined();

//     const testimonial = await t.query(api.resources.testimonials.get, { id: testimonialId });
//     expect(testimonial).toMatchObject({
//         name: "John Doe",
//         testimony: "Great service!",
//         status: "pending",
//     });
// });

// test("Create testimonial with custom fields", async () => {
//     const t = convexTest(schema);
//     const customTestimonial = {
//         name: "Jane Smith",
//         testimony: "Excellent experience!",
//         status: "accepted",
//         reviewDate: "2024-03-20T00:00:00.000Z",
//     };

//     const testimonialId = await t.mutation(api.resources.testimonials.create, customTestimonial);
//     const testimonial = await t.query(api.resources.testimonials.get, { id: testimonialId });
//     expect(testimonial).toMatchObject(customTestimonial);
// });

// test("List testimonials with pagination", async () => {
//     const t = convexTest(schema);
//     await createTestTestimonial(t, { name: "User 1" });
//     await createTestTestimonial(t, { name: "User 2" });

//     const result = await t.query(api.resources.testimonials.list, {
//         paginationOpts: { numItems: 1, cursor: null }
//     });

//     expect(result.page).toHaveLength(1);
//     expect(result.isDone).toBe(false);
// });

// test("Search testimonials by name", async () => {
//     const t = convexTest(schema);
//     await createTestTestimonial(t, { name: "John Smith" });
//     await createTestTestimonial(t, { name: "Jane Doe" });

//     const result = await t.query(api.resources.testimonials.list, {
//         searchQuery: "john",
//         paginationOpts: { numItems: 10, cursor: null }
//     });

//     expect(result.page).toHaveLength(1);
//     expect(result.page[0].name).toBe("John Smith");
// });

// test("Get single testimonial", async () => {
//     const t = convexTest(schema);
//     const testimonialId = await createTestTestimonial(t);

//     const testimonial = await t.query(api.resources.testimonials.get, { id: testimonialId });
//     expect(testimonial).toMatchObject({
//         name: "John Doe",
//         testimony: "Great service!",
//         status: "pending",
//     });
// });

// test("Get non-existent testimonial throws error", async () => {
//     const t = convexTest(schema);
//     const fakeId = "1234" as Id<"testimonials">;

//     await expect(
//         t.query(api.resources.testimonials.get, { id: fakeId })
//     ).rejects.toThrowError("Expected ID");
// });

// test("Update testimonial", async () => {
//     const t = convexTest(schema);
//     const testimonialId = await createTestTestimonial(t);

//     const updates = {
//         name: "Updated Name",
//         status: "accepted",
//     };

//     await t.mutation(api.resources.testimonials.update, {
//         id: testimonialId,
//         ...updates
//     });

//     const updated = await t.query(api.resources.testimonials.get, { id: testimonialId });
//     expect(updated).toMatchObject({
//         ...updates,
//         testimony: "Great service!", // Original field unchanged
//     });
// });

// test("Update non-existent testimonial throws error", async () => {
//     const t = convexTest(schema);
//     const fakeId = "1234" as Id<"testimonials">;

//     await expect(
//         t.mutation(api.resources.testimonials.update, {
//             id: fakeId,
//             name: "Updated Name"
//         })
//     ).rejects.toThrowError("Expected ID");
// });

// test("Delete testimonial", async () => {
//     const t = convexTest(schema);
//     const testimonialId = await createTestTestimonial(t);

//     await t.mutation(api.resources.testimonials.remove, { id: testimonialId });

//     const testimonial = await t.query(api.resources.testimonials.get, { id: testimonialId })
//     expect(testimonial).toBeNull();
// });

// test("Delete non-existent testimonial throws error", async () => {
//     const t = convexTest(schema);
//     const fakeId = "1234" as Id<"testimonials">;

//     await expect(
//         t.mutation(api.resources.testimonials.remove, { id: fakeId })
//     ).rejects.toThrowError("Expected ID");
// }); 
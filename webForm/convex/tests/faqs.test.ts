// import { convexTest } from "convex-test";
// import { expect, test } from "vitest";
// import schema from "../schema";
// import { api } from "../_generated/api";
// import { Id } from "../_generated/dataModel";

// const createTestFaq = async (t: any, overrides = {}) => {
//     const defaultFaq = {
//         question: "Test Question?",
//         answer: "Test Answer",
//         status: "draft" as const,
//         displayOrder: false,
//     };
//     return await t.mutation(api.resources.faqs.create, {
//         ...defaultFaq,
//         ...overrides
//     });
// };

// test("Create FAQ with all fields", async () => {
//     const t = convexTest(schema);
//     const faqData = {
//         question: "What is testing?",
//         answer: "Testing is important",
//         status: "published" as const,
//         displayOrder: true,
//     };

//     const faqId = await t.mutation(api.resources.faqs.create, faqData);
//     const faq = await t.query(api.resources.faqs.get, { id: faqId });
//     expect(faq).toMatchObject(faqData);
// });

// test("List FAQs with pagination", async () => {
//     const t = convexTest(schema);
//     await createTestFaq(t, { question: "First FAQ?" });
//     await createTestFaq(t, { question: "Second FAQ?" });

//     const result = await t.query(api.resources.faqs.list, {
//         paginationOpts: { numItems: 1, cursor: null }
//     });

//     expect(result.page).toHaveLength(1);
//     expect(result.isDone).toBe(false);
// });

// test("List FAQs with status filter", async () => {
//     const t = convexTest(schema);
//     await createTestFaq(t, { status: "published" });
//     await createTestFaq(t, { status: "draft" });

//     const result = await t.query(api.resources.faqs.list, {
//         status: "published",
//         paginationOpts: { numItems: 10, cursor: null }
//     });

//     expect(result.page).toHaveLength(1);
//     expect(result.page[0].status).toBe("published");
// });

// test("List FAQs with search query", async () => {
//     const t = convexTest(schema);
//     await createTestFaq(t, {
//         question: "Unique question?",
//         answer: "Regular answer"
//     });
//     await createTestFaq(t, {
//         question: "Regular question?",
//         answer: "Unique answer"
//     });

//     // Test searching in questions
//     const questionResult = await t.query(api.resources.faqs.list, {
//         searchQuery: "Unique question",
//         paginationOpts: { numItems: 10, cursor: null }
//     });
//     expect(questionResult.page).toHaveLength(1);
//     expect(questionResult.page[0].question).toContain("Unique question");

//     // Test searching in answers
//     const answerResult = await t.query(api.resources.faqs.list, {
//         searchQuery: "Unique answer",
//         paginationOpts: { numItems: 10, cursor: null }
//     });
//     expect(answerResult.page).toHaveLength(1);
//     expect(answerResult.page[0].answer).toContain("Unique answer");
// });

// test("Get FAQ by ID", async () => {
//     const t = convexTest(schema);
//     const faqId = await createTestFaq(t);
//     const faq = await t.query(api.resources.faqs.get, { id: faqId });
//     expect(faq).toBeDefined();
//     expect(faq?._id).toEqual(faqId);
// });

// test("Get non-existent FAQ", async () => {
//     const t = convexTest(schema);
//     const nonExistentId = "123" as Id<"faqs">;

//     void expect(async () => {
//         await t.query(api.resources.faqs.get, { id: nonExistentId });
//     }).rejects.toThrowError('Expected ID');
// });

// test("Update FAQ", async () => {
//     const t = convexTest(schema);
//     const faqId = await createTestFaq(t);

//     const updates = {
//         question: "Updated Question?",
//         answer: "Updated Answer",
//         status: "published" as const,
//         displayOrder: true,
//     };

//     await t.mutation(api.resources.faqs.update, {
//         id: faqId,
//         ...updates
//     });

//     const updatedFaq = await t.query(api.resources.faqs.get, { id: faqId });
//     expect(updatedFaq).toMatchObject(updates);
// });

// test("Update FAQ with partial fields", async () => {
//     const t = convexTest(schema);
//     const faqId = await createTestFaq(t);

//     const updates = {
//         question: "Only Question Updated?"
//     };

//     await t.mutation(api.resources.faqs.update, {
//         id: faqId,
//         ...updates
//     });

//     const updatedFaq = await t.query(api.resources.faqs.get, { id: faqId });
//     expect(updatedFaq?.question).toBe(updates.question);
//     expect(updatedFaq?.answer).toBe("Test Answer"); // Original value should remain
// });

// test("Delete FAQ", async () => {
//     const t = convexTest(schema);
//     const faqId = await createTestFaq(t);

//     await t.mutation(api.resources.faqs.remove, { id: faqId });
//     const deletedFaq = await t.query(api.resources.faqs.get, { id: faqId });

//     expect(deletedFaq).toBeNull();
// }); 
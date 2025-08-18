// import { expect, test } from "vitest";
// import { api } from "../_generated/api";
// import { convexTest } from "convex-test";
// import schema from "../schema";

// test("create - creates new page content", async () => {
//     const t = convexTest(schema);

//     const result = await t.mutation(api.resources.pageContents.create, {
//         label: "testLabel",
//         content: "testContent"
//     });

//     expect(result).toBeDefined();
//     expect(result!.label).toBe("testLabel");
//     expect(result!.content).toBe("testContent");
// });

// test("update - updates existing page content", async () => {
//     const t = convexTest(schema);

//     const created = await t.mutation(api.resources.pageContents.create, {
//         label: "testLabel",
//         content: "originalContent"
//     });

//     const updated = await t.mutation(api.resources.pageContents.update, {
//         id: created!._id,
//         content: "updatedContent"
//     });

//     expect(updated!.content).toBe("updatedContent");
//     expect(updated!.label).toBe(created!.label);
// });

// test("remove - deletes page content", async () => {
//     const t = convexTest(schema);

//     const created = await t.mutation(api.resources.pageContents.create, {
//         label: "testLabel",
//         content: "testContent"
//     });

//     await t.mutation(api.resources.pageContents.remove, {
//         id: created!._id
//     });

//     const result = await t.query(api.resources.pageContents.list, {
//         paginationOpts: { numItems: 10, cursor: null }
//     });

//     expect(result.page.length).toBe(0);
// });

// test("list - filters by label", async () => {
//     const t = convexTest(schema);

//     await t.mutation(api.resources.pageContents.create, {
//         label: "label1",
//         content: "content1"
//     });
//     await t.mutation(api.resources.pageContents.create, {
//         label: "label2",
//         content: "content2"
//     });

//     const filtered = await t.query(api.resources.pageContents.list, {
//         label: "label1",
//         paginationOpts: { numItems: 10, cursor: null }
//     });

//     expect(filtered.page.length).toBe(1);
//     expect(filtered.page[0].label).toBe("label1");
// });

// test("list - returns all when no label provided", async () => {
//     const t = convexTest(schema);

//     await t.mutation(api.resources.pageContents.create, {
//         label: "label1",
//         content: "content1"
//     });
//     await t.mutation(api.resources.pageContents.create, {
//         label: "label2",
//         content: "content2"
//     });

//     const all = await t.query(api.resources.pageContents.list, {
//         paginationOpts: { numItems: 10, cursor: null }
//     });

//     expect(all.page.length).toBe(2);
// });

// test("list - handles pagination", async () => {
//     const t = convexTest(schema);

//     for (let i = 0; i < 5; i++) {
//         await t.mutation(api.resources.pageContents.create, {
//             label: `label${i}`,
//             content: `content${i}`
//         });
//     }

//     const page1 = await t.query(api.resources.pageContents.list, {
//         paginationOpts: { numItems: 2, cursor: null }
//     });

//     const page2 = await t.query(api.resources.pageContents.list, {
//         paginationOpts: {
//             numItems: 2,
//             cursor: page1.page[page1.page.length - 1]._id
//         }
//     });

//     expect(page1.page.length).toBe(2);
//     expect(page2.page.length).toBe(2);
//     expect(page1.page[0]._id).not.toBe(page2.page[0]._id);
// });
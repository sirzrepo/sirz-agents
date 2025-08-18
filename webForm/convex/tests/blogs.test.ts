// import { expect, test } from "vitest";
// import { api, internal } from "../_generated/api";
// import { convexTest } from "convex-test";
// import schema from "../schema";
// import { Id } from "../_generated/dataModel";

// const mockBlog = {
//     title: "Test Blog",
//     content: "Test content",
//     summary: "Test summary",
//     status: "draft" as const,
//     tags: ["test", "blog"],
//     slug: "test-blog",
//     metaDescription: "Test meta description"
// };

// const getUser = async (t: any) => {
//     return await t.action(internal.internals.addFirstUser, {});
// };

// const addUser = async (t: any, email: string) => {
//     return await t.action(api.resources.users.addUserAccount, {
//         email,
//         password: "password",
//         name: "User"
//     });
// }

// test("create - creates new blog post", async () => {
//     const t = convexTest(schema);
//     const user = await getUser(t);

//     const result = await t.mutation(api.resources.blogs.create, {
//         ...mockBlog,
//         userEmail: user!.email
//     });

//     expect(result).toBeDefined();
//     expect(result).toMatchObject({
//         ...mockBlog,
//         author: user!._id,
//         views: 0,
//     });
// });

// test("create - sets publishedAt when status is published", async () => {
//     const t = convexTest(schema);
//     const user = await getUser(t);

//     const result = await t.mutation(api.resources.blogs.create, {
//         ...mockBlog,
//         status: "published",
//         userEmail: user!.email
//     });

//     expect(result.publishedAt).toBeDefined();
// });

// test("list - returns all blogs without filter", async () => {
//     const t = convexTest(schema);
//     const user = await getUser(t);

//     await t.mutation(api.resources.blogs.create, {
//         ...mockBlog,
//         userEmail: user!.email
//     });

//     await t.mutation(api.resources.blogs.create, {
//         ...mockBlog,
//         title: "Second Blog",
//         slug: "second-blog",
//         userEmail: user!.email
//     });

//     const result = await t.query(api.resources.blogs.list, {
//         paginationOpts: { numItems: 10, cursor: null }
//     });

//     expect(result.page.length).toBe(2);
// });

// test("list - filters by status", async () => {
//     const t = convexTest(schema);
//     const user = await getUser(t);

//     await t.mutation(api.resources.blogs.create, {
//         ...mockBlog,
//         status: "published",
//         userEmail: user!.email
//     });

//     await t.mutation(api.resources.blogs.create, {
//         ...mockBlog,
//         status: "draft",
//         title: "Draft Blog",
//         slug: "draft-blog",
//         userEmail: user!.email
//     });

//     const result = await t.query(api.resources.blogs.list, {
//         status: "published",
//         paginationOpts: { numItems: 10, cursor: null }
//     });

//     expect(result.page.length).toBe(1);
//     expect(result.page[0].status).toBe("published");
// });

// test("list - filters by tag", async () => {
//     const t = convexTest(schema);
//     const user = await getUser(t);

//     await t.mutation(api.resources.blogs.create, {
//         ...mockBlog,
//         tags: ["test"],
//         userEmail: user!.email
//     });

//     await t.mutation(api.resources.blogs.create, {
//         ...mockBlog,
//         tags: ["other"],
//         title: "Other Blog",
//         slug: "other-blog",
//         userEmail: user!.email
//     });

//     const result = await t.query(api.resources.blogs.list, {
//         tag: "test",
//         paginationOpts: { numItems: 10, cursor: null }
//     });

//     expect(result.page.length).toBe(1);
//     expect(result.page[0].tags).toContain("test");
// });

// test("get - retrieves blog by id", async () => {
//     const t = convexTest(schema);
//     const user = await getUser(t);

//     const created = await t.mutation(api.resources.blogs.create, {
//         ...mockBlog,
//         userEmail: user!.email
//     });

//     const result = await t.query(api.resources.blogs.get, {
//         id: created!._id!
//     });

//     expect(result).toBeDefined();
//     expect(result!.title).toBe(mockBlog.title);
// });

// test("getBySlug - retrieves blog by slug", async () => {
//     const t = convexTest(schema);
//     const user = await getUser(t);

//     await t.mutation(api.resources.blogs.create, {
//         ...mockBlog,
//         userEmail: user!.email
//     });

//     const result = await t.query(api.resources.blogs.getBySlug, {
//         slug: mockBlog.slug
//     });

//     expect(result).toBeDefined();
//     expect(result!.slug).toBe(mockBlog.slug);
// });

// test("update - updates blog post", async () => {
//     const t = convexTest(schema);
//     const user = await getUser(t);

//     const created = await t.mutation(api.resources.blogs.create, {
//         ...mockBlog,
//         userEmail: user!.email
//     });

//     const updated = await t.mutation(api.resources.blogs.update, {
//         id: created!._id!,
//         title: "Updated Title",
//         userEmail: user!.email
//     });

//     expect(updated!.title).toBe("Updated Title");
// });

// test("update - fails with non-owner user", async () => {
//     const t = convexTest(schema);
//     const user1 = await getUser(t);
//     const user2 = await addUser(t, "user2@test.com");

//     const created = await t.mutation(api.resources.blogs.create, {
//         ...mockBlog,
//         userEmail: user1!.email
//     });

//     await expect(async () =>
//         await t.mutation(api.resources.blogs.update, {
//             id: created!._id!,
//             title: "Updated Title",
//             userEmail: user2!.email!
//         })
//     ).rejects.toThrow("You are not authorized!");
// });

// test("remove - deletes blog post", async () => {
//     const t = convexTest(schema);
//     const user = await getUser(t);

//     const created = await t.mutation(api.resources.blogs.create, {
//         ...mockBlog,
//         userEmail: user!.email
//     });

//     await t.mutation(api.resources.blogs.remove, {
//         id: created!._id!,
//         userEmail: user!.email
//     });


//     void expect(async () => {
//         await t.query(api.resources.blogs.get, {
//             id: created!._id!
//         });
//     }).rejects.toThrow("Blog not found");
// });

// test("remove - fails with non-owner user", async () => {
//     const t = convexTest(schema);
//     const user1 = await getUser(t);
//     const user2 = await addUser(t, "user2@test.com");

//     const created = await t.mutation(api.resources.blogs.create, {
//         ...mockBlog,
//         userEmail: user1!.email
//     });

//     await expect(async () =>
//         await t.mutation(api.resources.blogs.remove, {
//             id: created!._id!,
//             userEmail: user2!.email
//         })
//     ).rejects.toThrow("You are not authorized!");
// });

// test("incrementViews - increases view count", async () => {
//     const t = convexTest(schema);
//     const user = await getUser(t);

//     const created = await t.mutation(api.resources.blogs.create, {
//         ...mockBlog,
//         userEmail: user!.email
//     });

//     const updated = await t.mutation(api.resources.blogs.incrementViews, {
//         id: created!._id!
//     });

//     expect(updated!.views).toBe(1);
// });

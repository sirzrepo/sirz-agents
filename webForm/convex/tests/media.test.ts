// import { expect, test } from "vitest";
// import { api, internal } from "../_generated/api";
// import { convexTest } from "convex-test";
// import schema from "../schema";
// import { Id } from "../_generated/dataModel";
// import { MockMedia } from "../global";

// const mockMedia: MockMedia = {
//     fileName: "test.jpg",
//     fileType: "image/jpeg",
//     fileSize: 1024,
//     storageId: "storage123" as Id<"_storage">,
//     mediaType: "image" as const,
//     metadata: {
//         width: 800,
//         height: 600,
//         description: "Test image"
//     }
// };

// const getUser = async (t: any) => {
//     return await t.action(internal.internals.addFirstUser, {})
// }

// test.skip("upload - creates new media with metadata", async () => {
//     const t = convexTest(schema);
//     const user = await getUser(t);

//     const result = await t.mutation(api.resources.media.upload, {
//         ...mockMedia,
//         userEmail: user!.email
//     });

//     expect(result).toBeDefined();
//     // const saved = await t.db.get(result);
//     expect(result).toMatchObject({
//         ...mockMedia,
//         uploadedBy: user!._id,
//     });
// });

// test.skip("upload - creates new media without metadata", async () => {
//     const t = convexTest(schema);
//     const user = await getUser(t);
//     const mediaWithoutMeta = { ...mockMedia };
//     delete mediaWithoutMeta.metadata;

//     const result = await t.mutation(api.resources.media.upload, {
//         ...mediaWithoutMeta,
//         userEmail: user!.email
//     });

//     expect(result!.metadata).toBeUndefined();
// });

// // test.skip("upload - fails without authentication", async () => {
// //     const t = convexTest(schema);
// //     // const user = await getUser(t);

// //     void expect(
// //         await t.mutation(api.resources.media.upload, mockMedia)
// //     ).rejects.toThrow("Authentication required");
// // });

// test.skip("list - returns all media without filter", async () => {
//     const t = convexTest(schema);
//     const user = await getUser(t);


//     await t.mutation(api.resources.media.upload, {
//         ...mockMedia,
//         userEmail: user!.email
//     });

//     await t.mutation(api.resources.media.upload, {
//         ...mockMedia,
//         mediaType: "video",
//         fileName: "test.mp4",
//         fileType: "video/mp4",
//         userEmail: user!.email
//     });

//     const result = await t.query(api.resources.media.list, {
//         paginationOpts: { numItems: 10, cursor: null }
//     });

//     expect(result.page.length).toBe(2);
// });

// test.skip("list - filters by mediaType", async () => {
//     const t = convexTest(schema);
//     const user = await getUser(t);

//     await t.mutation(api.resources.media.upload, {
//         ...mockMedia,
//         userEmail: user!.email
//     });
//     await t.mutation(api.resources.media.upload, {
//         ...mockMedia,
//         mediaType: "video",
//         fileName: "test.mp4",
//         fileType: "video/mp4",
//         userEmail: user!.email
//     });

//     const result = await t.query(api.resources.media.list, {
//         mediaType: "image",
//         paginationOpts: { numItems: 10, cursor: null }
//     });

//     expect(result.page.length).toBe(1);
//     expect(result.page[0].mediaType).toBe("image");
// });

// test.skip("list - handles pagination", async () => {
//     const t = convexTest(schema);
//     const user = await getUser(t);

//     for (let i = 0; i < 5; i++) {
//         await t.mutation(api.resources.media.upload, {
//             ...mockMedia,
//             fileName: `test${i}.jpg`,
//             userEmail: user!.email
//         });
//     }

//     const page1 = await t.query(api.resources.media.list, {
//         paginationOpts: { numItems: 2, cursor: null }
//     });

//     const page2 = await t.query(api.resources.media.list, {
//         paginationOpts: {
//             numItems: 2,
//             cursor: page1.page[page1.page.length - 1]._id
//         }
//     });

//     expect(page1.page.length).toBe(2);
//     expect(page2.page.length).toBe(2);
//     expect(page1.page[0]._id).not.toBe(page2.page[0]._id);
// });

// test.skip("remove - deletes media", async () => {
//     const t = convexTest(schema);
//     const user = await getUser(t);

//     const media = await t.mutation(api.resources.media.upload, {
//         ...mockMedia,
//         userEmail: user!.email
//     })

//     await t.mutation(api.resources.media.remove, { id: media!._id });
//     const deleted = await t.query(api.resources.media.get, { id: media!._id });
//     expect(deleted).toBeNull();
// });

// // test("remove - fails without authentication", async () => {
// //     const t = convexTest(schema);
// //     const user = await t.insertTestUser();

// //     const mediaId = await t.withUser(user, () =>
// //         t.mutation(api.resources.media.upload, mockMedia)
// //     );

// //     await expect(
// //         t.mutation(api.resources.media.remove, { id: mediaId })
// //     ).rejects.toThrow("Authentication required");
// // });

// test.skip("remove - fails with non-existent media", async () => {
//     const t = convexTest(schema);
//     // const user = await getUser(t);
//     const fakeId = "123" as Id<"media">;

//     await expect(async () =>
//         await t.mutation(api.resources.media.remove, { id: fakeId })
//     ).rejects.toThrow("Media not found");
// });

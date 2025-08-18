// import { convexTest } from "convex-test";
// import { expect, test } from "vitest";
// import schema from "../schema";
// import { api } from "../_generated/api";
// import { Id } from "../_generated/dataModel";

// const createTestProduct = async (t: any, overrides = {}) => {
//     const defaultProduct = {
//         name: "Test Product",
//         description: "Test Description",
//         price: "99.99"
//     };
//     return await t.mutation(api.resources.products.create, {
//         ...defaultProduct,
//         ...overrides
//     });
// };

// test("Create product with all fields", async () => {
//     const t = convexTest(schema);
//     const productData = {
//         name: "New Product",
//         description: "Product Description",
//         price: "199.99"
//     };

//     const productId = await t.mutation(api.resources.products.create, productData);
//     expect(productId).toBeDefined();

//     const product = await t.query(api.resources.products.get, { id: productId });
//     expect(product).toMatchObject(productData);
// });

// test("List products with pagination", async () => {
//     const t = convexTest(schema);
//     await createTestProduct(t, { name: "Product 1" });
//     await createTestProduct(t, { name: "Product 2" });

//     const result = await t.query(api.resources.products.list, {
//         paginationOpts: { numItems: 1, cursor: null }
//     });

//     expect(result.page).toHaveLength(1);
//     expect(result.isDone).toBe(false);
// });

// test("Search products by name", async () => {
//     const t = convexTest(schema);
//     await createTestProduct(t, { name: "Unique Product" });
//     await createTestProduct(t, { name: "Different Item" });

//     const result = await t.query(api.resources.products.list, {
//         searchQuery: "unique",
//         paginationOpts: { numItems: 10, cursor: null }
//     });

//     expect(result.page).toHaveLength(1);
//     expect(result.page[0].name).toBe("Unique Product");
// });

// test("Search products with no matches", async () => {
//     const t = convexTest(schema);
//     await createTestProduct(t);

//     const result = await t.query(api.resources.products.list, {
//         searchQuery: "nonexistent",
//         paginationOpts: { numItems: 10, cursor: null }
//     });

//     expect(result.page).toHaveLength(0);
// });

// test("Get single product", async () => {
//     const t = convexTest(schema);
//     const productId = await createTestProduct(t);

//     const product = await t.query(api.resources.products.get, { id: productId });
//     expect(product).toMatchObject({
//         name: "Test Product",
//         description: "Test Description",
//         price: "99.99"
//     });
// });

// test("Update product", async () => {
//     const t = convexTest(schema);
//     const productId = await createTestProduct(t);

//     const updates = {
//         name: "Updated Name",
//         price: "299.99"
//     };

//     await t.mutation(api.resources.products.update, {
//         id: productId,
//         ...updates
//     });

//     const updatedProduct = await t.query(api.resources.products.get, { id: productId });
//     expect(updatedProduct).toMatchObject({
//         ...updates,
//         description: "Test Description" // Unchanged field
//     });
// });

// test("Delete product", async () => {
//     const t = convexTest(schema);
//     const productId = await createTestProduct(t);

//     await t.mutation(api.resources.products.remove, { id: productId });
//     const deletedProduct = await t.query(api.resources.products.get, { id: productId });

//     expect(deletedProduct).toBeNull();
// });

// test("Get non-existent product", async () => {
//     const t = convexTest(schema);
//     const nonExistentId = "123" as Id<"products">;

//     void expect(async () => {
//         await t.query(api.resources.products.get, { id: nonExistentId });
//     }).rejects.toThrowError('Expected ID');
// });

// test("Update non-existent product", async () => {
//     const t = convexTest(schema);
//     const nonExistentId = "123" as Id<"products">;

//     void expect(async () => {
//         await t.mutation(api.resources.products.update, {
//             id: nonExistentId,
//             name: "New Name"
//         });
//     }).rejects.toThrowError('Expected ID');
// });

// test("Delete non-existent product", async () => {
//     const t = convexTest(schema);
//     const nonExistentId = "123" as Id<"products">;

//     void expect(async () => {
//         await t.mutation(api.resources.products.remove, { id: nonExistentId });
//     }).rejects.toThrowError('Expected ID');
// }); 
// import { convexTest } from "convex-test";
// import { expect, test } from "vitest";
// import schema from "../schema";
// import { api, internal } from "../_generated/api";
// import { SUPER_ADMIN_ROLE } from "../helpers/rbac";

// const users = [
//     {
//         name: "Test User 1",
//         email: "user1@test.com",
//         password: "password123",
//         username: "testuser1",
//         affiliated: true
//     },
//     {
//         name: "Test User 2",
//         email: "user2@test.com",
//         password: "password123",
//         username: "testuser2"
//     },
//     {
//         name: "Test User 3",
//         email: "user3@test.com",
//         password: "password123",
//         affiliated: false
//     }
// ];

// // beforeEach(async () => {
// //     const t = convexTest(schema);

// //     // for (const userData of users) {
// //     //     await t.action(api.resources.users.addUserAccount, userData);
// //     // }
// // });

// test("should create a user", async () => {
//     const t = convexTest(schema)

//     const userData = {
//         name: 'John Doe',
//         email: 'jd@gmail.com',
//         password: 'password'
//     }

//     const user = await t.action(api.resources.users.addUserAccount, userData)

//     expect(user?.name).toMatch(userData.name)
//     expect(user?.email).toMatch(userData.email)
// })

// test('should filter users by email', async () => {
//     const t = convexTest(schema);
//     const operations = users.map(userData => t.action(api.resources.users.addUserAccount, userData));
//     await Promise.all(operations);

//     const results = await t.query(api.resources.users.list, {
//         email: 'user2@test.com',
//         paginationOpts: { numItems: 10, cursor: null }
//     });
//     expect(results.page.length).toBe(1);
//     expect(results.page[0].email).toBe('user2@test.com');
// });

// test('should create user with role', async () => {
//     const t = convexTest(schema);
//     await t.mutation(internal.internals.addRolesAndPermissions, {});

//     const userData = {
//         name: 'Admin User',
//         email: 'admin@test.com',
//         password: 'password123',
//         roleName: SUPER_ADMIN_ROLE,
//         internalRequest: true
//     };

//     const user = await t.action(api.resources.users.addUserAccount, userData);
//     expect(user).not.toBeNull();
//     expect(user?.email).toBe(userData.email);
// });

// test('should throw error when password is undefined', async () => {
//     const t = convexTest(schema);
//     const userData = {
//         name: 'Invalid User',
//         email: 'invalid@test.com',
//         password: undefined as unknown as string
//     };

//     await expect(t.action(api.resources.users.addUserAccount, userData))
//         .rejects.toThrow('Missing required field');
// });

// test('should create user with default affiliated value', async () => {
//     const t = convexTest(schema);
//     const userData = {
//         name: 'Basic User',
//         email: 'basic@test.com',
//         password: 'password123'
//     };

//     const user = await t.action(api.resources.users.addUserAccount, userData);
//     expect(user?.affiliated).toBe(false);
// });

// // test('should return all users when no email filter is provided', async () => {
// //     const t = convexTest(schema);
// //     const operations = users.map(userData => t.action(api.resources.users.addUserAccount, userData));
// //     await Promise.all(operations);
// test.skip('should test authenticated user query', async () => {
//     const t = convexTest(schema);

//     await t.action(internal.internals.addFirstUser, {})

//     const userData = {
//         name: 'Auth User',
//         email: 'justiceroyale1@gmail.com',
//         password: 'password123'
//     };

//     await t.action(api.resources.users.addUserAccount, userData);
//     const asUser = t.withIdentity({ email: userData.email });
//     const authUser = await asUser.query(api.resources.users.authenticated, {});

//     expect(authUser).not.toBeNull();
//     expect(authUser?.email).toBe(userData.email);
// });

// test('should return all users when no email filter provided', async () => {
//     const t = convexTest(schema);
//     const operations = users.map(userData =>
//         t.action(api.resources.users.addUserAccount, userData)
//     );
//     await Promise.all(operations);

//     const results = await t.query(api.resources.users.list, {
//         paginationOpts: { numItems: 10, cursor: null }
//     });

//     expect(results.page.length).toBe(users.length);
// });

// test('should create user with username and affiliated true', async () => {
//     const t = convexTest(schema);
//     const userData = {
//         name: 'Test User',
//         email: 'test@test.com',
//         password: 'password123',
//         username: 'testuser',
//         affiliated: true
//     };

//     const user = await t.action(api.resources.users.addUserAccount, userData);
//     expect(user?.username).toBe(userData.username);
//     expect(user?.affiliated).toBe(true);
// });

// test('should throw error when password is undefined', async () => {
//     const t = convexTest(schema);
//     const userData = {
//         name: 'Test User',
//         email: 'test@example.com',
//         password: undefined as any // Force typescript to accept undefined
//     };

//     await expect(t.action(api.resources.users.addUserAccount, userData))
//         .rejects
//         .toThrow('Missing required field');
// });

// test('should update basic user fields', async () => {
//     const t = convexTest(schema);

//     // Create initial user
//     const initialUser = await t.action(api.resources.users.addUserAccount, {
//         name: 'Initial Name',
//         email: 'initial@test.com',
//         password: 'password123'
//     });

//     const updatedUser = await t.mutation(api.resources.users.update, {
//         id: initialUser!._id,
//         name: 'Updated Name',
//         affiliated: true
//     });

//     expect(updatedUser).not.toBeNull();
//     expect(updatedUser?.name).toBe('Updated Name');
//     expect(updatedUser?.affiliated).toBe(true);
// });

// test('should allow setting username when undefined', async () => {
//     const t = convexTest(schema);

//     const user = await t.action(api.resources.users.addUserAccount, {
//         name: 'Test User',
//         email: 'test@test.com',
//         password: 'password123'
//     });

//     const updatedUser = await t.mutation(api.resources.users.update, {
//         id: user!._id,
//         username: 'newusername'
//     });

//     expect(updatedUser?.username).toBe('newusername');
// });

// test('should throw error when modifying existing username', async () => {
//     const t = convexTest(schema);

//     const user = await t.action(api.resources.users.addUserAccount, {
//         name: 'Test User',
//         email: 'test@test.com',
//         password: 'password123',
//         username: 'existingusername'
//     });

//     await expect(t.mutation(api.resources.users.update, {
//         id: user!._id,
//         username: 'newusername'
//     })).rejects.toThrow('Usernames can not be modified after they are set');
// });

// test('should update user with role', async () => {
//     const t = convexTest(schema);
//     await t.mutation(internal.internals.addRolesAndPermissions, {});

//     const user = await t.action(api.resources.users.addUserAccount, {
//         name: 'Test User',
//         email: 'test@test.com',
//         password: 'password123'
//     });

//     const updatedUser = await t.mutation(api.resources.users.update, {
//         id: user!._id,
//         roleName: SUPER_ADMIN_ROLE
//     });

//     const roles = await t.query(api.resources.roles.listAll, {
//         userId: updatedUser!._id
//     });

//     expect(updatedUser).not.toBeNull();
//     expect(roles.length).toBe(1);
//     expect(roles[0].name).toBe(SUPER_ADMIN_ROLE);
// });

// test('should return null for non-existent user', async () => {
//     const t = convexTest(schema);

//     const nonExistentId = '1234567890' as any;
//     // const result = ;

//     void expect(async () => {
//         await t.mutation(api.resources.users.update, {
//             id: nonExistentId,
//             name: 'New Name'
//         })
//     }).rejects.toThrowError('Expected ID');
// });

// test('should not update when no changes provided', async () => {
//     const t = convexTest(schema);

//     const user = await t.action(api.resources.users.addUserAccount, {
//         name: 'Test User',
//         email: 'test@test.com',
//         password: 'password123'
//     });

//     const updatedUser = await t.mutation(api.resources.users.update, {
//         id: user!._id,
//         name: 'Test User',
//         email: 'test@test.com'
//     });

//     expect(updatedUser).not.toBeNull();
//     expect(updatedUser?.name).toBe(user?.name);
//     expect(updatedUser?.email).toBe(user?.email);
// });

// test('should update email with validation', async () => {
//     const t = convexTest(schema);

//     const user = await t.action(api.resources.users.addUserAccount, {
//         name: 'Test User',
//         email: 'old@test.com',
//         password: 'password123'
//     });

//     const updatedUser = await t.mutation(api.resources.users.update, {
//         id: user!._id,
//         email: 'new@test.com'
//     });

//     expect(updatedUser?.email).toBe('new@test.com');
// });

// test('should update multiple fields simultaneously', async () => {
//     const t = convexTest(schema);

//     const user = await t.action(api.resources.users.addUserAccount, {
//         name: 'Original Name',
//         email: 'original@test.com',
//         password: 'password123'
//     });

//     const updatedUser = await t.mutation(api.resources.users.update, {
//         id: user!._id,
//         name: 'New Name',
//         email: 'new@test.com',
//         affiliated: true
//     });

//     expect(updatedUser).not.toBeNull();
//     expect(updatedUser?.name).toBe('New Name');
//     expect(updatedUser?.email).toBe('new@test.com');
//     expect(updatedUser?.affiliated).toBe(true);
// });

// // test('should deactivate a user', async () => {
// //     const t = convexTest(schema);

// //     const user = await t.action(api.resources.users.addUserAccount, {
// //         name: 'Active User',
// //         email: 'active@test.com',
// //         password: 'password123'
// //     });

// //     await t.mutation(api.resources.users.deactivate, { id: user!._id });

// //     const deactivatedUser = await t.query(api.resources.users.list, {
// //         email: 'active@test.com',
// //         paginationOpts: { numItems: 10, cursor: null }
// //     });

// //     expect(deactivatedUser.page.length).toBe(1);
// //     expect(deactivatedUser.page[0].active).toBe(false);
// // });

// test('should throw error when deactivating non-existent user', async () => {
//     const t = convexTest(schema);

//     const nonExistentId = 'nonexistentid' as any;

//     await expect(t.mutation(api.resources.users.deactivate, { id: nonExistentId }))
//         .rejects.toThrow('Expected ID');
// });
// import { convexTest } from "convex-test";
// import { expect, test } from "vitest";
// import schema from "../schema";
// import { api, internal } from "../_generated/api";
// import { CREATE_USERS_PERMISSION, DEACTIVATE_USERS_PERMISSION, ORDER_MANAGER_ROLE, READ_USERS_PERMISSION, UPDATE_USERS_PERMISSION } from "../helpers/rbac";

// test("Get all permissions", async () => {
//     const t = convexTest(schema);
//     await t.mutation(internal.internals.addRolesAndPermissions, {})
//     const permissions = await t.query(api.resources.permissions.listAll, {});
//     const permissionNames = permissions.map(item => item.name)

//     expect(permissionNames).toEqual(expect.arrayContaining(
//         [
//             CREATE_USERS_PERMISSION,
//             READ_USERS_PERMISSION,
//             UPDATE_USERS_PERMISSION,
//             DEACTIVATE_USERS_PERMISSION,
//         ]
//     ));
// });

// test("Get permissions for a given role", async () => {
//     const t = convexTest(schema);
//     await t.mutation(internal.internals.addRolesAndPermissions, {})
//     const permissions = await t.query(api.resources.permissions.listAll, {
//         roleName: ORDER_MANAGER_ROLE
//     });
//     const permissionNames = permissions.map(item => item.name)

//     expect(permissionNames).toEqual([]);
// });
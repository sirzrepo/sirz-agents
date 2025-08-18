import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "../schema";
import { api, internal } from "../_generated/api";
import { CREATE_USERS_PERMISSION, READ_USERS_PERMISSION } from "../helpers/rbac";

export const SUPER_ADMIN_ROLE = 'super admin';
export const BRANCH_MANAGER_ROLE = 'branch manager';
export const DEPARTMENT_HEAD_ROLE = 'department head';
export const SALES_REP_ROLE = 'sales rep';
export const CUSTOMER_SERVICE_ROLE = 'customer service';
export const USER_ROLE = 'user';

test("Can get all roles", async () => {
    const t = convexTest(schema);
    await t.mutation(internal.internals.addRolesAndPermissions, {})
    const roles = await t.query(api.resources.roles.listAll, {});
    const roleNames = roles.map(item => item.name)

    expect(roleNames).toEqual(expect.arrayContaining(
        [
            SUPER_ADMIN_ROLE,
            BRANCH_MANAGER_ROLE,
            DEPARTMENT_HEAD_ROLE,
            SALES_REP_ROLE,
            CUSTOMER_SERVICE_ROLE,
            USER_ROLE
        ]
    ));
});

test("Can get paginated roles", async () => {
    const t = convexTest(schema);
    await t.mutation(internal.internals.addRolesAndPermissions, {})
    const roles = await t.query(api.resources.roles.list, {
        paginationOpts: {
            numItems: 6,
            cursor: null
        }
    });
    const roleNames = roles.page.map(item => item.name)

    expect(roleNames).toEqual(expect.arrayContaining(
        [
            SUPER_ADMIN_ROLE,
            BRANCH_MANAGER_ROLE,
            DEPARTMENT_HEAD_ROLE,
            SALES_REP_ROLE,
            CUSTOMER_SERVICE_ROLE,
            USER_ROLE
        ]
    ));
});


test("Can create a role", async () => {
    const t = convexTest(schema);

    await t.mutation(api.resources.roles.create, {
        name: SUPER_ADMIN_ROLE
    })
    const roles = await t.query(api.resources.roles.listAll, {});

    expect(roles[0].name).toEqual(SUPER_ADMIN_ROLE);
});

test("Can not create a role with an empty name", async () => {
    const t = convexTest(schema);

    void expect(async () => {
        await t.mutation(api.resources.roles.create, {
            name: ''
        })
    }).rejects.toThrowError("Name parameter can not be empty")
});

test("Can not create a role with a duplicate name", async () => {
    const t = convexTest(schema);

    await t.mutation(api.resources.roles.create, {
        name: SUPER_ADMIN_ROLE
    })
    void expect(async () => {
        await t.mutation(api.resources.roles.create, {
            name: SUPER_ADMIN_ROLE
        })
    }).rejects.toThrowError("name already exists")
});

test("Can create a role with permissions", async () => {
    const t = convexTest(schema);
    const roleName = SUPER_ADMIN_ROLE
    const permissionNames = [
        CREATE_USERS_PERMISSION,
        READ_USERS_PERMISSION
    ]

    await t.run(async (ctx) => {
        const createPermissions = permissionNames.map(item => {
            return ctx.db.insert("permissions", {
                name: item
            });
        })

        if (createPermissions.length > 0) {
            await Promise.all(createPermissions)
        }
    })

    await t.mutation(api.resources.roles.create, {
        name: roleName,
        permissionNames
    })
    const permissions = await t.query(api.resources.permissions.listAll, {
        roleName
    });

    const addedPermissionNames = permissions.map(item => item.name)

    expect(addedPermissionNames).toEqual(expect.arrayContaining(permissionNames));
});

test("Can get a single role", async () => {
    const t = convexTest(schema);
    const roleName = SUPER_ADMIN_ROLE

    const role = await t.mutation(api.resources.roles.create, {
        name: roleName,
    })
    const responseData = await t.query(api.resources.roles.get, {
        id: role!._id
    });

    expect(responseData?.name).toEqual(roleName);
});

test("Can update a role", async () => {
    const t = convexTest(schema);
    const roleName = SUPER_ADMIN_ROLE
    const updatedRoleName = BRANCH_MANAGER_ROLE

    const role = await t.mutation(api.resources.roles.create, {
        name: roleName,
    })

    const updatedRole = await t.mutation(api.resources.roles.update, {
        id: role!._id,
        name: updatedRoleName
    });

    const responseData = await t.query(api.resources.roles.get, {
        id: updatedRole!._id,
    });

    expect(responseData?.name).not.toEqual(roleName);
    expect(responseData?.name).toEqual(updatedRole?.name);
});

test("Can not update a role with the name of an existing role", async () => {
    const t = convexTest(schema);
    const roleName = SUPER_ADMIN_ROLE
    const updatedRoleName = BRANCH_MANAGER_ROLE

    await t.mutation(internal.internals.addRolesAndPermissions, {})

    const roles = await t.query(api.resources.roles.listAll, {
        roleName,
    })

    void expect(async () => {
        await t.mutation(api.resources.roles.update, {
            id: roles.at(0)!._id,
            name: updatedRoleName
        })
    }).rejects.toThrowError('name already exists');
});

test("Can update a role's permissions", async () => {
    const t = convexTest(schema);
    const roleName = DEPARTMENT_HEAD_ROLE
    const permissionName = CREATE_USERS_PERMISSION

    await t.mutation(internal.internals.addRolesAndPermissions, {})

    const roles = await t.run(async (ctx) => {
        return await ctx.db.query('roles')
            .filter((q) => q.eq(q.field('name'), roleName))
            .collect()
    })

    const permissions = await t.query(api.resources.permissions.listAll, {
        roleName
    });

    expect(permissions).toEqual([])

    await t.mutation(api.resources.roles.update, {
        id: roles.at(0)!._id,
        permissionNames: [permissionName]
    });

    const updatedPermissions = await t.query(api.resources.permissions.listAll, {
        roleName
    });

    const permissionNames = updatedPermissions.map(item => item.name)

    expect(permissionNames).toEqual(expect.arrayContaining([
        permissionName
    ]));
});

test("Can delete a role", async () => {
    const t = convexTest(schema);
    const roleName = SUPER_ADMIN_ROLE

    await t.mutation(internal.internals.addRolesAndPermissions, {})

    const roles = await t.run(async (ctx) => {
        return await ctx.db.query('roles')
            .filter((q) => q.eq(q.field('name'), roleName))
            .collect()
    })

    await t.mutation(api.resources.roles.destroy, {
        id: roles.at(0)!._id
    })

    const permissions = await t.query(api.resources.permissions.listAll, {
        roleName
    });

    const role = await t.query(api.resources.roles.get, {
        id: roles.at(0)!._id
    });

    expect(permissions).toEqual([])
    expect(role).toEqual(null);
});

test("Can delete a role and it's permission references", async () => {
    const t = convexTest(schema);
    await t.mutation(internal.internals.addRolesAndPermissions, {})

    const roleName = SUPER_ADMIN_ROLE

    const roles = await t.query(api.resources.roles.listAll, {
        roleName
    })

    await t.mutation(api.resources.roles.destroy, {
        id: roles.at(0)!._id
    })

    const permissions = await t.query(api.resources.permissions.listAll, {
        roleName
    });

    const role = await t.query(api.resources.roles.get, {
        id: roles.at(0)!._id
    });

    expect(permissions).toEqual([])
    expect(role).toEqual(null);
});
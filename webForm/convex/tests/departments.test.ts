import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "../schema";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

const createTestDepartment = async (t: any, overrides = {}) => {
    const defaultDepartment = {
        name: "Test Department",
        description: "Test Description",
    };
    return await t.mutation(api.resources.departments.create, {
        ...defaultDepartment,
        ...overrides
    });
};

test("Create department with minimal fields", async () => {
    const t = convexTest(schema);
    const deptId = await createTestDepartment(t);
    expect(deptId).toBeDefined();

    const dept = await t.query(api.resources.departments.listAll, {});
    expect(dept[0]).toMatchObject({
        name: "Test Department",
        description: "Test Description",
        active: true,
    });
});

test("Create department with all fields", async () => {
    const t = convexTest(schema);
    const fullDept = {
        name: "Full Department",
        description: "Full Description",
        active: false,
    };

    await t.mutation(api.resources.departments.create, fullDept);
    const result = await t.query(api.resources.departments.listAll, { active: false });
    expect(result[0]).toMatchObject(fullDept);
});

test("List departments with pagination", async () => {
    const t = convexTest(schema);
    await createTestDepartment(t, { name: "Dept1" });
    await createTestDepartment(t, { name: "Dept2" });

    const result = await t.query(api.resources.departments.list, {
        paginationOpts: { numItems: 1, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.isDone).toBe(false);
});

test("Filter departments by name", async () => {
    const t = convexTest(schema);
    await createTestDepartment(t, { name: "Engineering" });
    await createTestDepartment(t, { name: "Marketing" });

    const result = await t.query(api.resources.departments.list, {
        name: "eng",
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.page[0].name).toBe("Engineering");
});

test("Filter departments by active status", async () => {
    const t = convexTest(schema);
    await createTestDepartment(t, { active: false });
    await createTestDepartment(t, { active: true });

    const result = await t.query(api.resources.departments.list, {
        active: false,
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.page[0].active).toBe(false);
});

test("List all departments with filters", async () => {
    const t = convexTest(schema);
    await createTestDepartment(t, { name: "Active Dept", active: true });
    await createTestDepartment(t, { name: "Inactive Dept", active: false });

    const result = await t.query(api.resources.departments.listAll, {
        active: true,
        name: "active"
    });

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Active Dept");
});

test("Update department", async () => {
    const t = convexTest(schema);
    const deptId = await createTestDepartment(t);

    const updates = {
        name: "Updated Department",
        description: "Updated Description"
    };

    await t.mutation(api.resources.departments.update, {
        id: deptId,
        ...updates
    });

    const result = await t.query(api.resources.departments.listAll, {});
    expect(result[0]).toMatchObject(updates);
});

test("Update department with no changes", async () => {
    const t = convexTest(schema);
    const deptId = await createTestDepartment(t);

    void expect(async () => {
        await t.mutation(api.resources.departments.update, {
            id: deptId
        });
    }).rejects.toThrowError('No updates provided');
});

test("Deactivate department", async () => {
    const t = convexTest(schema);
    const deptId = await createTestDepartment(t);

    await t.mutation(api.resources.departments.deactivate, { id: deptId });
    const result = await t.query(api.resources.departments.listAll, { active: false });

    expect(result).toHaveLength(1);
    expect(result[0].active).toBe(false);
});

test("Invalid department ID handling", async () => {
    const t = convexTest(schema);
    const invalidId = "123" as Id<"departments">;

    void expect(async () => {
        await t.mutation(api.resources.departments.update, { id: invalidId })
    }).rejects.toThrowError('Expected ID');
});

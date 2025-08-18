import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "../schema";
import { api, internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

const createTestAccessLog = async (t: any, overrides = {}) => {
    const defaultLog = {
        path: "/test",
        method: "GET",
        timestamp: Date.now(),
    };
    return await t.mutation(api.resources.accessLogs.logAccess, {
        ...defaultLog,
        ...overrides
    });
};

test("Create access log with minimal fields", async () => {
    const t = convexTest(schema);
    const logId = await createTestAccessLog(t);
    expect(logId).toBeDefined();

    const log = await t.query(api.resources.accessLogs.get, { id: logId });
    expect(log).toMatchObject({
        path: "/test",
        method: "GET",
    });
});

test("Create access log with all fields", async () => {
    const t = convexTest(schema);
    await t.action(internal.internals.addFirstUser, {});

    const users = await t.query(api.resources.users.list, {
        paginationOpts: { numItems: 1, cursor: null }
    });

    const fullLog = {
        path: "/test-full",
        method: "POST",
        timestamp: Date.now(),
        userId: users.page.at(0)?._id as Id<"users">,
        userAgent: "Mozilla",
        ipAddress: "127.0.0.1"
    };

    const logId = await t.mutation(api.resources.accessLogs.logAccess, fullLog);
    const log = await t.query(api.resources.accessLogs.get, { id: logId });
    expect(log).toMatchObject(fullLog);
});

test("List access logs with pagination", async () => {
    const t = convexTest(schema);
    await createTestAccessLog(t, { path: "/test1" });
    await createTestAccessLog(t, { path: "/test2" });

    const result = await t.query(api.resources.accessLogs.list, {
        paginationOpts: { numItems: 1, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.isDone).toBe(false);
});

test("Filter access logs by path", async () => {
    const t = convexTest(schema);
    await createTestAccessLog(t, { path: "/test1" });
    await createTestAccessLog(t, { path: "/test2" });

    const result = await t.query(api.resources.accessLogs.list, {
        path: "/test1",
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.page[0].path).toBe("/test1");
});

test("Delete access log", async () => {
    const t = convexTest(schema);
    const logId = await createTestAccessLog(t);

    await t.mutation(api.resources.accessLogs.remove, { id: logId });
    const deletedLog = await t.query(api.resources.accessLogs.get, { id: logId });

    expect(deletedLog).toBeNull();
});

test("Get non-existent access log", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"accessLogs">;

    void expect(async () => {
        await t.query(api.resources.accessLogs.get, { id: nonExistentId })
    }).rejects.toThrowError('Expected ID');
});
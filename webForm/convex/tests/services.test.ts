import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "../schema";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

const createTestService = async (t: any, overrides = {}) => {
    const defaultService = {
        name: "Test Service",
        description: "Test Description",
        price: "100.00"
    };
    return await t.mutation(api.resources.services.create, {
        ...defaultService,
        ...overrides
    });
};

test("Create service with all fields", async () => {
    const t = convexTest(schema);
    const serviceData = {
        name: "Premium Service",
        description: "A premium service offering",
        price: "199.99"
    };

    const serviceId = await t.mutation(api.resources.services.create, serviceData);
    expect(serviceId).toBeDefined();

    const service = await t.query(api.resources.services.get, { id: serviceId });
    expect(service).toMatchObject(serviceData);
});

test("List services with pagination", async () => {
    const t = convexTest(schema);
    await createTestService(t, { name: "Service 1" });
    await createTestService(t, { name: "Service 2" });

    const result = await t.query(api.resources.services.list, {
        paginationOpts: { numItems: 1, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.isDone).toBe(false);
});

test("Search services by name", async () => {
    const t = convexTest(schema);
    await createTestService(t, { name: "Premium Service" });
    await createTestService(t, { name: "Basic Service" });

    const result = await t.query(api.resources.services.list, {
        searchQuery: "Premium",
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.page[0].name).toBe("Premium Service");
});

test("Get service by ID", async () => {
    const t = convexTest(schema);
    const serviceId = await createTestService(t);

    const service = await t.query(api.resources.services.get, { id: serviceId });
    expect(service).toMatchObject({
        name: "Test Service",
        description: "Test Description",
        price: "100.00"
    });
});

test("Update service", async () => {
    const t = convexTest(schema);
    const serviceId = await createTestService(t);

    const updates = {
        name: "Updated Service",
        price: "150.00"
    };

    await t.mutation(api.resources.services.update, {
        id: serviceId,
        ...updates
    });

    const updatedService = await t.query(api.resources.services.get, { id: serviceId });
    expect(updatedService).toMatchObject({
        ...updates,
        description: "Test Description" // Original description should remain unchanged
    });
});

test("Delete service", async () => {
    const t = convexTest(schema);
    const serviceId = await createTestService(t);

    await t.mutation(api.resources.services.remove, { id: serviceId });
    const deletedService = await t.query(api.resources.services.get, { id: serviceId });

    expect(deletedService).toBeNull();
});

test("Get non-existent service", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"services">;

    void expect(async () => {
        await t.query(api.resources.services.get, { id: nonExistentId })
    }).rejects.toThrowError('Expected ID');
});

test("Update service with partial fields", async () => {
    const t = convexTest(schema);
    const serviceId = await createTestService(t);

    // Update only the description
    await t.mutation(api.resources.services.update, {
        id: serviceId,
        description: "Updated Description"
    });

    const updatedService = await t.query(api.resources.services.get, { id: serviceId });
    expect(updatedService).toMatchObject({
        name: "Test Service", // Original name should remain unchanged
        description: "Updated Description",
        price: "100.00" // Original price should remain unchanged
    });
});

test("List services with empty search query", async () => {
    const t = convexTest(schema);
    await createTestService(t, { name: "Service 1" });
    await createTestService(t, { name: "Service 2" });

    const result = await t.query(api.resources.services.list, {
        searchQuery: "",
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page.length).toBeGreaterThanOrEqual(2);
}); 
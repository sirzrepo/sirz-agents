import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "../schema";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

const createTestBooking = async (t: any, overrides = {}) => {
    const defaultBooking = {
        companyName: "Test Company",
        participantName: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        status: "pending"
    };
    return await t.mutation(api.resources.bookings.create, {
        ...defaultBooking,
        ...overrides
    });
};

test("Create booking with all required fields", async () => {
    const t = convexTest(schema);
    const bookingId = await createTestBooking(t);
    expect(bookingId).toBeDefined();

    const booking = await t.query(api.resources.bookings.list, {
        paginationOpts: { numItems: 1, cursor: null }
    });
    expect(booking.page[0]).toMatchObject({
        companyName: "Test Company",
        participantName: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        status: "pending"
    });
});

test("Create booking with different values", async () => {
    const t = convexTest(schema);
    const customBooking = {
        companyName: "Custom Corp",
        participantName: "Jane Smith",
        email: "jane@example.com",
        phone: "+9876543210",
        status: "confirmed"
    };

    await createTestBooking(t, customBooking);

    const result = await t.query(api.resources.bookings.list, {
        paginationOpts: { numItems: 1, cursor: null }
    });
    expect(result.page[0]).toMatchObject(customBooking);
});

test("List bookings with pagination", async () => {
    const t = convexTest(schema);
    await createTestBooking(t, { companyName: "Company 1" });
    await createTestBooking(t, { companyName: "Company 2" });

    const result = await t.query(api.resources.bookings.list, {
        paginationOpts: { numItems: 1, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.isDone).toBe(false);
});

test("Filter bookings by status", async () => {
    const t = convexTest(schema);
    await createTestBooking(t, { status: "pending" });
    await createTestBooking(t, { status: "confirmed" });

    const result = await t.query(api.resources.bookings.list, {
        status: "pending",
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.page[0].status).toBe("pending");
});

test("Update booking", async () => {
    const t = convexTest(schema);
    const bookingId = await createTestBooking(t);

    const updates = {
        companyName: "Updated Company",
        status: "confirmed"
    };

    await t.mutation(api.resources.bookings.update, {
        id: bookingId,
        ...updates
    });

    const result = await t.query(api.resources.bookings.list, {
        paginationOpts: { numItems: 1, cursor: null }
    });
    expect(result.page[0]).toMatchObject({
        ...result.page[0],
        ...updates
    });
});

test("Update non-existent booking", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"bookings">;

    await expect(async () => {
        await t.mutation(api.resources.bookings.update, {
            id: nonExistentId,
            status: "confirmed"
        });
    }).rejects.toThrow("Expected ID");
});

test("Delete booking", async () => {
    const t = convexTest(schema);
    const bookingId = await createTestBooking(t);

    await t.mutation(api.resources.bookings.remove, { id: bookingId });

    const result = await t.query(api.resources.bookings.list, {
        paginationOpts: { numItems: 10, cursor: null }
    });
    expect(result.page).toHaveLength(0);
});

test("Delete non-existent booking", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"bookings">;

    await expect(async () => {
        await t.mutation(api.resources.bookings.remove, { id: nonExistentId });
    }).rejects.toThrow("Expected ID");
}); 
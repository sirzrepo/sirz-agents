import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "../schema";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

const createTestUser = async (t: any) => {
    return await t.action(api.resources.users.addUserAccount, {
        email: "test@example.com",
        name: "Test User",
        password: "password",
    });
};

// Helper function to create a test event
const createTestEvent = async (t: any, overrides = {}) => {
    const user = await createTestUser(t);
    const defaultEvent = {
        title: "Test Event",
        description: "Test Description",
        dateTime: "2024-03-20T10:00:00Z",
        venue: "Test Venue",
        venueType: "physical",
        eventType: "conference",
        createdBy: user._id,
    };
    return await t.mutation(api.resources.events.create, {
        ...defaultEvent,
        ...overrides
    });
};

// Helper function to create a test attendee
const createTestAttendee = async (t: any, eventId: Id<"events">, overrides = {}) => {
    const defaultAttendee = {
        eventId,
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
    };
    return await t.mutation(api.resources.eventAttendees.create, {
        ...defaultAttendee,
        ...overrides
    });
};

test("Create event attendee with minimal fields", async () => {
    const t = convexTest(schema);
    const eventId = await createTestEvent(t);
    const attendeeId = await createTestAttendee(t, eventId);

    expect(attendeeId).toBeDefined();

    const attendee = await t.query(api.resources.eventAttendees.get, { id: attendeeId });
    expect(attendee).toMatchObject({
        eventId,
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        checkedIn: false,
    });
});

test("Create event attendee with all fields", async () => {
    const t = convexTest(schema);
    const eventId = await createTestEvent(t);

    const fullAttendee = {
        eventId,
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+9876543210",
        checkedIn: true,
    };

    const attendeeId = await t.mutation(api.resources.eventAttendees.create, fullAttendee);
    const attendee = await t.query(api.resources.eventAttendees.get, { id: attendeeId });
    expect(attendee).toMatchObject(fullAttendee);
});

test("Create attendee with non-existent event should fail", async () => {
    const t = convexTest(schema);
    const nonExistentEventId = "123" as Id<"events">;

    await expect(async () => {
        await t.mutation(api.resources.eventAttendees.create, {
            eventId: nonExistentEventId,
            name: "John Doe",
            email: "john@example.com",
            phone: "+1234567890",
        });
    }).rejects.toThrowError("Expected ID");
});

test("List event attendees with pagination", async () => {
    const t = convexTest(schema);
    const eventId = await createTestEvent(t);
    await createTestAttendee(t, eventId, { name: "Attendee 1" });
    await createTestAttendee(t, eventId, { name: "Attendee 2" });

    const result = await t.query(api.resources.eventAttendees.list, {
        paginationOpts: { numItems: 1, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.isDone).toBe(false);
});

test("Filter attendees by event ID", async () => {
    const t = convexTest(schema);
    const event1Id = await createTestEvent(t, { title: "Event 1" });
    const event2Id = await createTestEvent(t, { title: "Event 2" });

    await createTestAttendee(t, event1Id, { name: "Event 1 Attendee" });
    await createTestAttendee(t, event2Id, { name: "Event 2 Attendee" });

    const result = await t.query(api.resources.eventAttendees.list, {
        eventId: event1Id,
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.page[0].name).toBe("Event 1 Attendee");
});

test("Filter attendees by multiple criteria", async () => {
    const t = convexTest(schema);
    const eventId = await createTestEvent(t);

    await createTestAttendee(t, eventId, {
        name: "Test User",
        email: "test@example.com",
        phone: "+1111111111",
        checkedIn: true
    });

    const result = await t.query(api.resources.eventAttendees.list, {
        name: "Test User",
        email: "test@example.com",
        phone: "+1111111111",
        checkedIn: true,
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.page[0]).toMatchObject({
        name: "Test User",
        email: "test@example.com",
        phone: "+1111111111",
        checkedIn: true
    });
});

test("Update event attendee", async () => {
    const t = convexTest(schema);
    const eventId = await createTestEvent(t);
    const attendeeId = await createTestAttendee(t, eventId);

    const updates = {
        name: "Updated Name",
        email: "updated@example.com",
        phone: "+9999999999",
        checkedIn: true
    };

    const updatedAttendee = await t.mutation(api.resources.eventAttendees.update, {
        id: attendeeId,
        ...updates
    });

    expect(updatedAttendee).toMatchObject(updates);
});

test("Update non-existent attendee should fail", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"eventAttendees">;

    await expect(async () => {
        await t.mutation(api.resources.eventAttendees.update, {
            id: nonExistentId,
            name: "Updated Name"
        });
    }).rejects.toThrowError("Expected ID");
});

test("Delete event attendee", async () => {
    const t = convexTest(schema);
    const eventId = await createTestEvent(t);
    const attendeeId = await createTestAttendee(t, eventId);

    const deletedAttendee = await t.mutation(api.resources.eventAttendees.remove, { id: attendeeId });
    expect(deletedAttendee).toBeNull();

    await expect(async () => {
        await t.query(api.resources.eventAttendees.get, { id: attendeeId })
    }).rejects.toThrowError("Attendee not found");
});

test("Delete non-existent attendee should fail", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"eventAttendees">;

    await expect(async () => {
        await t.mutation(api.resources.eventAttendees.remove, { id: nonExistentId });
    }).rejects.toThrowError("Expected ID");
});

test("Get non-existent attendee should fail", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"eventAttendees">;

    await expect(async () => {
        await t.query(api.resources.eventAttendees.get, { id: nonExistentId });
    }).rejects.toThrowError("Expected ID");
}); 
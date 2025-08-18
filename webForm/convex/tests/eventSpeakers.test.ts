import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "../schema";
import { api, internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";

const createTestEvent = async (t: any) => {
    return await t.mutation(api.resources.events.create, {
        title: "Test Event",
        description: "Test Description",
        dateTime: "2024-03-20T10:00:00Z",
        venue: "Test Venue",
        venueType: "physical",
        eventType: "conference",
        createdBy: await getTestUserId(t),
    });
};

const getTestUserId = async (t: any) => {
    await t.action(internal.internals.addFirstUser, {});
    const users = await t.query(api.resources.users.list, {
        paginationOpts: { numItems: 1, cursor: null }
    });
    return users.page[0]._id;
};

const createTestSpeaker = async (t: any, overrides = {}) => {
    const eventId = await createTestEvent(t);
    const defaultSpeaker = {
        eventId,
        name: "Test Speaker",
        description: "Test Speaker Description",
    };
    return await t.mutation(api.resources.eventSpeakers.create, {
        ...defaultSpeaker,
        ...overrides
    });
};

test("Create speaker with minimal fields", async () => {
    const t = convexTest(schema);
    const eventId = await createTestEvent(t);

    const speakerId = await t.mutation(api.resources.eventSpeakers.create, {
        eventId,
        name: "Test Speaker",
    });
    expect(speakerId).toBeDefined();

    const speaker = await t.query(api.resources.eventSpeakers.get, { id: speakerId });
    expect(speaker).toMatchObject({
        eventId,
        name: "Test Speaker",
    });
});

test("Create speaker with all fields", async () => {
    const t = convexTest(schema);
    const eventId = await createTestEvent(t);

    const fullSpeaker = {
        eventId,
        name: "Full Test Speaker",
        description: "Full Test Description",
        // thumbnail: "123" as Id<"_storage">,
    };

    const speakerId = await t.mutation(api.resources.eventSpeakers.create, fullSpeaker);
    const speaker = await t.query(api.resources.eventSpeakers.get, { id: speakerId });
    expect(speaker).toMatchObject({
        ...fullSpeaker,
        // thumbnailUrl: undefined, // Since storage URL can't be mocked in tests
    });
});

test("Create speaker with non-existent event should fail", async () => {
    const t = convexTest(schema);
    const nonExistentEventId = "123" as Id<"events">;

    await expect(async () => {
        await t.mutation(api.resources.eventSpeakers.create, {
            eventId: nonExistentEventId,
            name: "Test Speaker",
        });
    }).rejects.toThrow("Expected ID");
});

test("List speakers with pagination", async () => {
    const t = convexTest(schema);
    await createTestSpeaker(t, { name: "Speaker 1" });
    await createTestSpeaker(t, { name: "Speaker 2" });

    const result = await t.query(api.resources.eventSpeakers.list, {
        paginationOpts: { numItems: 1, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.isDone).toBe(false);
});

test("Filter speakers by event", async () => {
    const t = convexTest(schema);
    const event1Id = await createTestEvent(t);
    const event2Id = await createTestEvent(t);

    await t.mutation(api.resources.eventSpeakers.create, {
        eventId: event1Id,
        name: "Speaker for Event 1",
    });
    await t.mutation(api.resources.eventSpeakers.create, {
        eventId: event2Id,
        name: "Speaker for Event 2",
    });

    const result = await t.query(api.resources.eventSpeakers.list, {
        eventId: event1Id,
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.page[0].eventId).toBe(event1Id);
});

test("Filter speakers by name", async () => {
    const t = convexTest(schema);
    await createTestSpeaker(t, { name: "Unique Speaker" });
    await createTestSpeaker(t, { name: "Another Speaker" });

    const result = await t.query(api.resources.eventSpeakers.list, {
        name: "Unique Speaker",
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.page[0].name).toBe("Unique Speaker");
});

test("Get speaker by ID", async () => {
    const t = convexTest(schema);
    const speakerId = await createTestSpeaker(t);
    const speaker = await t.query(api.resources.eventSpeakers.get, { id: speakerId });
    expect(speaker).toBeDefined();
    expect(speaker.name).toBe("Test Speaker");
});

test("Get non-existent speaker should fail", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"eventSpeakers">;

    await expect(async () => {
        await t.query(api.resources.eventSpeakers.get, { id: nonExistentId });
    }).rejects.toThrow();
});

test("Update speaker", async () => {
    const t = convexTest(schema);
    const speakerId = await createTestSpeaker(t);

    const updates = {
        name: "Updated Name",
        description: "Updated Description",
    };

    await t.mutation(api.resources.eventSpeakers.update, {
        id: speakerId,
        ...updates,
    });

    const updated = await t.query(api.resources.eventSpeakers.get, { id: speakerId });
    expect(updated).toMatchObject(updates);
});

test("Update non-existent speaker should fail", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"eventSpeakers">;

    await expect(async () => {
        await t.mutation(api.resources.eventSpeakers.update, {
            id: nonExistentId,
            name: "New Name",
        });
    }).rejects.toThrow("Expected ID");
});

test("Delete speaker", async () => {
    const t = convexTest(schema);
    const speakerId = await createTestSpeaker(t);

    await t.mutation(api.resources.eventSpeakers.remove, { id: speakerId });

    await expect(async () => {
        await t.query(api.resources.eventSpeakers.get, { id: speakerId });
    }).rejects.toThrow("Speaker not found");
});

test("Delete non-existent speaker should fail", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"eventSpeakers">;

    await expect(async () => {
        await t.mutation(api.resources.eventSpeakers.remove, { id: nonExistentId });
    }).rejects.toThrow("Expected ID");
}); 
import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "../schema";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

const createTestJob = async (t: any, overrides = {}) => {
    const defaultJob = {
        title: "Software Engineer",
        description: "Test job description",
        status: "open",
        openings: 1,
    };
    return await t.mutation(api.resources.jobs.create, {
        ...defaultJob,
        ...overrides
    });
};

test("Create job with minimal fields", async () => {
    const t = convexTest(schema);
    const jobId = await createTestJob(t);
    expect(jobId).toBeDefined();

    const job = await t.query(api.resources.jobs.get, { id: jobId });
    expect(job).toMatchObject({
        title: "Software Engineer",
        description: "Test job description",
        status: "open",
        openings: 1,
    });
});

test("Create job with all fields", async () => {
    const t = convexTest(schema);
    const fullJob = {
        title: "Senior Developer",
        description: "Full stack developer position",
        status: "open",
        openings: 2,
        deadline: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
        startDate: Date.now() + 45 * 24 * 60 * 60 * 1000,
        endDate: Date.now() + 410 * 24 * 60 * 60 * 1000,
        employmentType: "full-time",
        salary: 100000,
        salaryCurrency: "USD",
        salaryPeriod: "yearly"
    };

    const jobId = await t.mutation(api.resources.jobs.create, fullJob);
    const job = await t.query(api.resources.jobs.get, { id: jobId });
    expect(job).toMatchObject(fullJob);
});

test("List jobs with pagination", async () => {
    const t = convexTest(schema);
    await createTestJob(t, { title: "Job 1" });
    await createTestJob(t, { title: "Job 2" });

    const result = await t.query(api.resources.jobs.list, {
        paginationOpts: { numItems: 1, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.isDone).toBe(false);
});

test("Filter jobs by status", async () => {
    const t = convexTest(schema);
    await createTestJob(t, { status: "open" });
    await createTestJob(t, { status: "closed" });

    const result = await t.query(api.resources.jobs.list, {
        status: "open",
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page.every(job => job.status === "open")).toBe(true);
});

test("Update job", async () => {
    const t = convexTest(schema);
    const jobId = await createTestJob(t);

    const updates = {
        title: "Updated Title",
        openings: 3,
        status: "closed"
    };

    await t.mutation(api.resources.jobs.update, { id: jobId, ...updates });
    const updatedJob = await t.query(api.resources.jobs.get, { id: jobId });

    expect(updatedJob).toMatchObject(updates);
});

test("Delete job", async () => {
    const t = convexTest(schema);
    const jobId = await createTestJob(t);

    await t.mutation(api.resources.jobs.remove, { id: jobId });

    await expect(
        t.query(api.resources.jobs.get, { id: jobId })
    ).rejects.toThrow("Job not found");
});

test("Get non-existent job", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"jobs">;

    await expect(
        t.query(api.resources.jobs.get, { id: nonExistentId })
    ).rejects.toThrow();
});

test("Update non-existent job", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"jobs">;

    await expect(
        t.mutation(api.resources.jobs.update, {
            id: nonExistentId,
            title: "New Title"
        })
    ).rejects.toThrow();
});

test("Delete non-existent job", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"jobs">;

    await expect(
        t.mutation(api.resources.jobs.remove, { id: nonExistentId })
    ).rejects.toThrow();
});

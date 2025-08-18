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

const createTestJob = async (t: any, overrides = {}) => {
    const defaultJob = {
        title: "Test Job",
        status: "open",
        openings: 1,
        description: "Test Description",
        department: await createTestDepartment(t),
        employmentType: "full-time",
        salary: 100000,
        salaryCurrency: "USD",
        salaryPeriod: "monthly",
    };
    return await t.mutation(api.resources.jobs.create, {
        ...defaultJob,
        ...overrides
    });
};

const createTestJobApplicant = async (t: any, overrides = {}) => {
    const jobId = await createTestJob(t, {
        department: await createTestDepartment(t)
    });
    const defaultApplicant = {
        jobId,
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        status: "applied"
    };
    return await t.mutation(api.resources.jobApplicants.create, {
        ...defaultApplicant,
        ...overrides
    });
};

test("Create job applicant with minimal fields", async () => {
    const t = convexTest(schema);
    const applicantId = await createTestJobApplicant(t);
    expect(applicantId).toBeDefined();

    const applicant = await t.query(api.resources.jobApplicants.getById, { id: applicantId });
    expect(applicant).toMatchObject({
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        status: "applied"
    });
});

test("Create job applicant with all fields", async () => {
    const t = convexTest(schema);
    const fullApplicant = {
        jobId: await createTestJob(t),
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "987-654-3210",
        // resume: "abc123" as Id<"_storage">,
        status: "interviewed"
    };

    const applicantId = await t.mutation(api.resources.jobApplicants.create, fullApplicant);
    const applicant = await t.query(api.resources.jobApplicants.getById, { id: applicantId });
    expect(applicant).toMatchObject(fullApplicant);
});

test("List job applicants with pagination", async () => {
    const t = convexTest(schema);
    await createTestJobApplicant(t, { email: "test1@example.com" });
    await createTestJobApplicant(t, { email: "test2@example.com" });

    const result = await t.query(api.resources.jobApplicants.list, {
        paginationOpts: { numItems: 1, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.isDone).toBe(false);
});

test("Filter job applicants by jobId", async () => {
    const t = convexTest(schema);
    const jobId1 = await createTestJob(t);
    const jobId2 = await createTestJob(t);

    await createTestJobApplicant(t, { jobId: jobId1 });
    await createTestJobApplicant(t, { jobId: jobId2 });

    const result = await t.query(api.resources.jobApplicants.list, {
        jobId: jobId1,
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.page[0].jobId).toBe(jobId1);
});

test("Filter job applicants by status", async () => {
    const t = convexTest(schema);
    await createTestJobApplicant(t, { status: "applied" });
    await createTestJobApplicant(t, { status: "interviewed" });

    const result = await t.query(api.resources.jobApplicants.list, {
        status: "applied",
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.page[0].status).toBe("applied");
});

test("Filter job applicants by email", async () => {
    const t = convexTest(schema);
    await createTestJobApplicant(t, { email: "test1@example.com" });
    await createTestJobApplicant(t, { email: "test2@example.com" });

    const result = await t.query(api.resources.jobApplicants.list, {
        email: "test1@example.com",
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.page[0].email).toBe("test1@example.com");
});

test("Update job applicant", async () => {
    const t = convexTest(schema);
    const applicantId = await createTestJobApplicant(t);

    const updates = {
        name: "Updated Name",
        status: "hired"
    };

    await t.mutation(api.resources.jobApplicants.update, {
        id: applicantId,
        ...updates
    });

    const updatedApplicant = await t.query(api.resources.jobApplicants.getById, { id: applicantId });
    expect(updatedApplicant).toMatchObject(updates);
});

test("Delete job applicant", async () => {
    const t = convexTest(schema);
    const applicantId = await createTestJobApplicant(t);

    await t.mutation(api.resources.jobApplicants.remove, { id: applicantId });

    await expect(async () => {
        await t.query(api.resources.jobApplicants.getById, { id: applicantId });
    }).rejects.toThrow("Applicant not found");
});

test("Get non-existent job applicant", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"jobApplicants">;

    await expect(async () => {
        await t.query(api.resources.jobApplicants.getById, { id: nonExistentId });
    }).rejects.toThrow("Expected ID");
});

test("Update non-existent job applicant", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"jobApplicants">;

    await expect(async () => {
        await t.mutation(api.resources.jobApplicants.update, {
            id: nonExistentId,
            name: "Test"
        });
    }).rejects.toThrow("Expected ID");
});

test("Delete non-existent job applicant", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"jobApplicants">;

    await expect(async () => {
        await t.mutation(api.resources.jobApplicants.remove, { id: nonExistentId });
    }).rejects.toThrow("Expected ID");
}); 
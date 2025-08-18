import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import schema from "../schema";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";

const createTestBlog = async (t: any) => {
    const user = await t.action(api.resources.users.addUserAccount, {
        email: "test-author",
        password: "password",
        name: "Test Author"
    });

    return await t.mutation(api.resources.blogs.create, {
        userEmail: user.email,
        title: "Test Blog",
        content: "Test Content",
        summary: "Test Summary",
        status: "published",
        tags: ["test"],
        slug: "test-blog",
    });
};

const createTestComment = async (t: any, blogId: Id<"blogs">, overrides = {}) => {
    const defaultComment = {
        blogId,
        authorName: "Test Author",
        content: "Test Comment",
    };
    return await t.mutation(api.resources.blogComments.create, {
        ...defaultComment,
        ...overrides
    });
};

test("Create blog comment with required fields", async () => {
    const t = convexTest(schema);
    const blog = await createTestBlog(t);
    const blogId = blog._id;
    await createTestComment(t, blogId);

    const result = await t.query(api.resources.blogComments.list, {
        blogId,
        paginationOpts: { numItems: 1, cursor: null }
    });

    expect(result.page[0]).toMatchObject({
        blogId,
        authorName: "Test Author",
        content: "Test Comment"
    });
});

test("List comments for specific blog", async () => {
    const t = convexTest(schema);
    const blog = await createTestBlog(t);
    const blogId = blog._id;

    // Create multiple comments
    await createTestComment(t, blogId, { content: "Comment 1" });
    await createTestComment(t, blogId, { content: "Comment 2" });

    const result = await t.query(api.resources.blogComments.list, {
        blogId,
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page).toHaveLength(2);
});

test("List comments with pagination", async () => {
    const t = convexTest(schema);
    const blog = await createTestBlog(t);
    const blogId = blog._id;

    // Create multiple comments
    await createTestComment(t, blogId, { content: "Comment 1" });
    await createTestComment(t, blogId, { content: "Comment 2" });

    const result = await t.query(api.resources.blogComments.list, {
        blogId,
        paginationOpts: { numItems: 1, cursor: null }
    });

    expect(result.page).toHaveLength(1);
    expect(result.isDone).toBe(false);
});

test("List all comments without blog filter", async () => {
    const t = convexTest(schema);
    const blog1 = await createTestBlog(t);
    const blog2 = await createTestBlog(t);
    const blogId1 = blog1._id;
    const blogId2 = blog2._id;

    await createTestComment(t, blogId1);
    await createTestComment(t, blogId2);

    const result = await t.query(api.resources.blogComments.list, {
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page).toHaveLength(2);
});

test("Delete comment", async () => {
    const t = convexTest(schema);
    const blog = await createTestBlog(t);
    const blogId = blog._id;
    const comment = await createTestComment(t, blogId);
    const commentId = comment._id;

    await t.mutation(api.resources.blogComments.remove, { id: commentId });

    const result = await t.query(api.resources.blogComments.list, {
        blogId,
        paginationOpts: { numItems: 10, cursor: null }
    });

    expect(result.page).toHaveLength(0);
});

test("Delete non-existent comment", async () => {
    const t = convexTest(schema);
    const nonExistentId = "123" as Id<"blogComments">;

    await expect(async () => {
        await t.mutation(api.resources.blogComments.remove, { id: nonExistentId });
    }).rejects.toThrow();
});

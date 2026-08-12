import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "@/app.module";
import { PrismaService } from "@/database";

import request from "supertest";

import { Headers } from "@/enums";

describe("PostsController (e2e)", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let ownerToken: string;
  let ownerId: string;
  let otherToken: string;

  const postPayload = {
    title: "Test Post",
    postname: "test_post",
    content: "This is a test post content.",
  };

  const updatedPayload = {
    title: "Updated Title",
    postname: "updated_post",
    content: "Updated content.",
  };

  const createUser = async (username: string, email: string) => {
    const response = await request(app.getHttpServer())
      .post("/api/v1/auth/")
      .set(Headers.email, email)
      .set(Headers.password, "secret")
      .send({ username, nickname: username })
      .expect(HttpStatus.CREATED);
    return response.body;
  };

  const createPost = async (token: string, data: typeof postPayload) => {
    const response = await request(app.getHttpServer())
      .post("/api/v1/posts")
      .set(Headers.authorization, `Bearer ${token}`)
      .send(data)
      .expect(HttpStatus.CREATED);

    return response.body;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();

    prismaService = app.get(PrismaService);

    await prismaService.$transaction([
      prismaService.notification.deleteMany(),
      prismaService.friendRequest.deleteMany(),
      prismaService.follow.deleteMany(),
      prismaService.block.deleteMany(),
      prismaService.commentReaction.deleteMany(),
      prismaService.postReaction.deleteMany(),
      prismaService.comment.deleteMany(),
      prismaService.post.deleteMany(),
      prismaService.service.deleteMany(),
      prismaService.auth.deleteMany(),
      prismaService.user.deleteMany(),
    ]);

    const owner = await createUser("postowner", "posts_postowner@example.com");
    ownerToken = owner.auth.token;
    ownerId = owner.user.id;

    const other = await createUser("otheruser", "posts_otheruser@example.com");
    otherToken = other.auth.token;
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  describe("POST /api/v1/posts", () => {
    it("should create a post when authenticated", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/posts")
        .set(Headers.authorization, `Bearer ${ownerToken}`)
        .send(postPayload)
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject({
        title: postPayload.title,
        postname: postPayload.postname,
        content: postPayload.content,
        userId: ownerId,
      });
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");
    });

    it("should return 401 when not authenticated", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/posts")
        .send(postPayload)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it("should return 400 for invalid data (missing title)", async () => {
      const invalid = { postname: "no_title", content: "..." };
      await request(app.getHttpServer())
        .post("/api/v1/posts")
        .set(Headers.authorization, `Bearer ${ownerToken}`)
        .send(invalid)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("should return 400 for too short title", async () => {
      const invalid = { title: "", postname: "short", content: "..." };
      await request(app.getHttpServer())
        .post("/api/v1/posts")
        .set(Headers.authorization, `Bearer ${ownerToken}`)
        .send(invalid)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/v1/posts", () => {
    beforeAll(async () => {
      await createPost(ownerToken, {
        title: "First Post",
        postname: "first_post",
        content: "First content",
      });

      await createPost(ownerToken, {
        title: "Second Post",
        postname: "second_post",
        content: "Second content",
      });
    });

    it("should return list of posts (public)", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/posts")
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0]).toHaveProperty("id");
      expect(response.body[0]).toHaveProperty("title");
    });

    it("should support pagination", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/posts?limit=5&sort=asc&sortBy=title")
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
    });

    it("should support cursor pagination", async () => {
      const firstPage = await request(app.getHttpServer())
        .get("/api/v1/posts?limit=2&sort=asc")
        .expect(HttpStatus.OK);

      const lastId = firstPage.body[firstPage.body.length - 1].id;
      const secondPage = await request(app.getHttpServer())
        .get(`/api/v1/posts?limit=2&sort=asc&cursor=${lastId}`)
        .expect(HttpStatus.OK);

      expect(secondPage.body[0].id).not.toBe(lastId);
    });

    it("should return 400 for invalid sortBy", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/posts?sortBy=invalid")
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/v1/posts/:slug", () => {
    let postname: string;

    beforeAll(async () => {
      const post = await createPost(ownerToken, {
        title: "Get One Post",
        postname: "get_one_post",
        content: "Content for get one",
      });
      postname = post.postname;
    });

    it("should return a post by postname (public)", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/posts/~${postname}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        postname: postname,
        title: "Get One Post",
      });
      expect(response.body).toHaveProperty("id");
    });

    it("should return 404 if post not found", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/posts/~non_existent")
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe("PUT /api/v1/posts/:slug", () => {
    let postname: string;

    beforeAll(async () => {
      const post = await createPost(ownerToken, {
        title: "Update Me",
        postname: "update_me",
        content: "Original content",
      });
      postname = post.postname;
    });

    it("should update own post", async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/v1/posts/~${postname}`)
        .set(Headers.authorization, `Bearer ${ownerToken}`)
        .send(updatedPayload)
        .expect(HttpStatus.OK);

      postname = updatedPayload.postname;

      expect(response.body).toMatchObject({
        title: updatedPayload.title,
        postname: updatedPayload.postname,
        content: updatedPayload.content,
      });
      expect(response.body.id).toBeDefined();
    });

    it("should reject update by another user", async () => {
      await request(app.getHttpServer())
        .put(`/api/v1/posts/~${postname}`)
        .set(Headers.authorization, `Bearer ${otherToken}`)
        .send({ title: "Hack" })
        .expect(HttpStatus.NOT_ACCEPTABLE);
    });

    it("should return 401 without token", async () => {
      await request(app.getHttpServer())
        .put(`/api/v1/posts/~${postname}`)
        .send(updatedPayload)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it("should return 400 for invalid data (empty title)", async () => {
      await request(app.getHttpServer())
        .put(`/api/v1/posts/~${postname}`)
        .set(Headers.authorization, `Bearer ${ownerToken}`)
        .send({ title: "" })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe("PATCH /api/v1/posts/:slug", () => {
    let postname: string;

    beforeAll(async () => {
      const post = await createPost(ownerToken, {
        title: "Patch Me",
        postname: "patch_me",
        content: "Original patch content",
      });
      postname = post.postname;
    });

    it("should partially update own post", async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/posts/~${postname}`)
        .set(Headers.authorization, `Bearer ${ownerToken}`)
        .set("Content-Type", "application/json")
        .send({ title: "Patched Title" })
        .expect(HttpStatus.OK);

      expect(response.body.title).toBe("Patched Title");
      expect(response.body.postname).toBe(postname);
      expect(response.body.content).toBe("Original patch content");
    });

    it("should reject patch by another user", async () => {
      await request(app.getHttpServer())
        .patch(`/api/v1/posts/~${postname}`)
        .set(Headers.authorization, `Bearer ${otherToken}`)
        .send({ title: "Hack Patch" })
        .expect(HttpStatus.NOT_ACCEPTABLE);
    });
  });

  describe("DELETE /api/v1/posts/:slug", () => {
    let postname: string;
    let postId: string;

    beforeAll(async () => {
      const post = await createPost(ownerToken, {
        title: "Delete Me",
        postname: "delete_me",
        content: "To be deleted",
      });
      postname = post.postname;
      postId = post.id;
    });

    it("should delete own post", async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/posts/${postId}`)
        .set(Headers.authorization, `Bearer ${ownerToken}`)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get(`/api/v1/posts/~${postname}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it("should reject delete by another user", async () => {
      const post = await createPost(ownerToken, {
        title: "Another",
        postname: "another_delete",
        content: "content",
      });

      await request(app.getHttpServer())
        .delete(`/api/v1/posts/${post.id}`)
        .set(Headers.authorization, `Bearer ${otherToken}`)
        .expect(HttpStatus.NOT_ACCEPTABLE);
    });

    it("should return 401 without token", async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/posts/~${postname}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it("should return 404 for non-existent post", async () => {
      await request(app.getHttpServer())
        .delete("/api/v1/posts/non_existent")
        .set(Headers.authorization, `Bearer ${ownerToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});

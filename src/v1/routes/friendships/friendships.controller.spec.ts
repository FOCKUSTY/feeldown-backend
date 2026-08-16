import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "@/app.module";
import { FriendRequestStatus } from "@1/types";
import { PrismaService } from "@/database";
import { Headers } from "@/enums";

import request from "supertest";

describe("FriendshipsController (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let userAToken: string;
  let userIdA: string;
  let userBToken: string;
  let userIdB: string;
  let userCToken: string;
  let userIdC: string;

  const deleteRequestByUser = async (userId: string, token: string) => {
    return request(app.getHttpServer())
      .delete(`/api/v1/friendships?userId=${userId}`)
      .set(Headers.authorization, `Bearer ${token}`)
      .expect(HttpStatus.OK);
  };

  const createUser = async (username: string, email: string) => {
    const response = await request(app.getHttpServer())
      .post("/api/v1/auth/")
      .set(Headers.email, email)
      .set(Headers.password, "secret")
      .send({ username, nickname: username })
      .expect(HttpStatus.CREATED);

    return {
      token: response.body.auth.token,
      userId: response.body.user.id,
    };
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

    prisma = app.get(PrismaService);

    await prisma.$transaction([
      prisma.notification.deleteMany(),
      prisma.friendRequest.deleteMany(),
      prisma.follow.deleteMany(),
      prisma.block.deleteMany(),
      prisma.commentReaction.deleteMany(),
      prisma.postReaction.deleteMany(),
      prisma.comment.deleteMany(),
      prisma.post.deleteMany(),
      prisma.service.deleteMany(),
      prisma.auth.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    const userA = await createUser("friend_a", "friendships_a@example.com");
    userAToken = userA.token;
    userIdA = userA.userId;

    const userB = await createUser("friend_b", "friendships_b@example.com");
    userBToken = userB.token;
    userIdB = userB.userId;

    const userC = await createUser("friend_c", "friendships_c@example.com");
    userCToken = userC.token;
    userIdC = userC.userId;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe("POST /api/v1/friendships", () => {
    it("should create a friend request", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ receiverId: userIdB })
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject({
        senderId: userIdA,
        receiverId: userIdB,
        status: FriendRequestStatus.PENDING,
      });
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");
    });

    it("should return 409 if request already exists", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ receiverId: userIdB })
        .expect(HttpStatus.CONFLICT);
    });

    it("should return 400 if receiverId is missing", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("should return 403 if trying to send request to yourself", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ receiverId: userIdA })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/v1/friendships/:userSlug/friends", () => {
    let friendRequestId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .send({ receiverId: userIdA })
        .expect(HttpStatus.CREATED);

      friendRequestId = response.body.id;

      await request(app.getHttpServer())
        .put(`/api/v1/friendships/${friendRequestId}?status=ACCEPTED`)
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);
    });

    it("should return friends list for user A", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/friendships/.friend_a/friends`)
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      expect(response.body[0]).toMatchObject({
        id: userIdB,
        username: "friend_b",
      });
    });

    it("should support pagination", async () => {
      const response = await request(app.getHttpServer())
        .get(
          `/api/v1/friendships/.friend_a/friends?limit=1&sort=asc&sortBy=createdAt`,
        )
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
    });

    it("should return 404 if user not found", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/friendships/.nonexistent/friends")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /api/v1/friendships/:id", () => {
    let requestId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userCToken}`)
        .send({ receiverId: userIdA })
        .expect(HttpStatus.CREATED);

      requestId = response.body.id;
    });

    it("should return friend request by ID (sender)", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/friendships/${requestId}`)
        .set(Headers.authorization, `Bearer ${userCToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: requestId,
        senderId: userIdC,
        receiverId: userIdA,
        status: FriendRequestStatus.PENDING,
      });
    });

    it("should return friend request by ID (receiver)", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/friendships/${requestId}`)
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: requestId,
        senderId: userIdC,
        receiverId: userIdA,
      });
    });

    it("should return 404 if request not found", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/friendships/00000000-0000-0000-0000-000000000000")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe("PUT /api/v1/friendships/:id", () => {
    let requestId: string;

    beforeAll(async () => {
      await deleteRequestByUser(userIdA, userBToken);
      const response = await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .send({ receiverId: userIdA })
        .expect(HttpStatus.CREATED);

      requestId = response.body.id;
    });

    it("should accept a friend request (ACCEPTED)", async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/v1/friendships/${requestId}?status=ACCEPTED`)
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.status).toBe(FriendRequestStatus.ACCEPTED);
    });

    it("should reject a friend request (REJECTED)", async () => {
      await deleteRequestByUser(userIdA, userCToken);
      const newRequest = await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userCToken}`)
        .send({ receiverId: userIdA })
        .expect(HttpStatus.CREATED);

      const response = await request(app.getHttpServer())
        .put(`/api/v1/friendships/${newRequest.body.id}?status=REJECTED`)
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body.status).toBe(FriendRequestStatus.REJECTED);
    });

    it("should return 400 for invalid status", async () => {
      await request(app.getHttpServer())
        .put(`/api/v1/friendships/${requestId}?status=INVALID`)
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe("PATCH /api/v1/friendships/:id (alias for PUT)", () => {
    it("should accept using PATCH", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .send({ receiverId: userIdC })
        .expect(HttpStatus.CREATED);

      const reqId = response.body.id;

      const patchResponse = await request(app.getHttpServer())
        .patch(`/api/v1/friendships/${reqId}?status=ACCEPTED`)
        .set(Headers.authorization, `Bearer ${userCToken}`)
        .expect(HttpStatus.OK);

      expect(patchResponse.body.status).toBe(FriendRequestStatus.ACCEPTED);
    });
  });
});

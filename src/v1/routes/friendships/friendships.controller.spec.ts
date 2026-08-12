import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "@/app.module";
import { PrismaService } from "@/database";
import { Headers } from "@/enums";
import { FriendRequestStatus } from "@1/types";

import request from "supertest";

describe("FriendshipsController (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userAToken: string;
  let userBToken: string;
  let userAId: string;
  let userBId: string;

  const createUser = async (username: string, email: string) => {
    const response = await request(app.getHttpServer())
      .post("/api/v1/auth/")
      .set(Headers.email, email)
      .set(Headers.password, "secret")
      .send({ username, nickname: username })
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

    const userA = await createUser("friendA", "friendA@example.com");
    userAToken = userA.auth.token;
    userAId = userA.user.id;

    const userB = await createUser("friendB", "friendB@example.com");
    userBToken = userB.auth.token;
    userBId = userB.user.id;
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
        .send({ receiverId: userBId })
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject({
        senderId: userAId,
        receiverId: userBId,
        status: FriendRequestStatus.PENDING,
      });
      expect(response.body).toHaveProperty("id");
    });

    it("should return 401 when not authenticated", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .send({ receiverId: userBId })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it("should return 400 for invalid receiverId", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ receiverId: "not-a-uuid" })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("should return 409 when duplicate request", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ receiverId: userBId })
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe("GET /api/v1/friendships", () => {
    beforeAll(async () => {
      // создать ещё один запрос от userB к userA, чтобы проверить фильтрацию
      await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .send({ receiverId: userAId })
        .expect(HttpStatus.CREATED);
    });

    it("should return list of friendships for current user (pending by default?)", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
      // По умолчанию фильтр статус = ACCEPTED, а у нас только PENDING, так что пусто
      expect(response.body.length).toBe(0);
    });

    it("should return pending requests when filtered by status", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/friendships?status=PENDING")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toMatchObject({
        senderId: userAId,
        receiverId: userBId,
        status: FriendRequestStatus.PENDING,
      });
    });

    it("should support pagination and sorting", async () => {
      const response = await request(app.getHttpServer())
        .get(
          "/api/v1/friendships?limit=1&offset=0&sort=asc&sortBy=createdAt&status=PENDING",
        )
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
    });

    it("should return 400 for invalid sortBy", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/friendships?sortBy=invalid")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("should return 401 without token", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/friendships")
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe("GET /api/v1/friendships/:id", () => {
    let friendshipId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ receiverId: userBId })
        .expect(HttpStatus.CREATED);
      friendshipId = response.body.id;
    });

    it("should return a friendship by id for current user", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/friendships/${friendshipId}`)
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: friendshipId,
        senderId: userAId,
        receiverId: userBId,
      });
    });

    it("should return 403 when trying to access another user's friendship", async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/friendships/${friendshipId}`)
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .expect(HttpStatus.FORBIDDEN);
    });

    it("should return 401 without token", async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/friendships/${friendshipId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it("should return 404 if friendship not found", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/friendships/00000000-0000-0000-0000-000000000000")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe("PUT /api/v1/friendships/:id", () => {
    let pendingId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ receiverId: userBId })
        .expect(HttpStatus.CREATED);
      pendingId = response.body.id;
    });

    it("should accept a friend request", async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/v1/friendships/${pendingId}`)
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .send({ status: "ACCEPTED" })
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: pendingId,
        status: FriendRequestStatus.ACCEPTED,
      });
    });

    it("should reject a friend request", async () => {
      const createRes = await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ receiverId: userBId })
        .expect(HttpStatus.CREATED);
      const id = createRes.body.id;

      const response = await request(app.getHttpServer())
        .put(`/api/v1/friendships/${id}`)
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .send({ status: "REJECTED" })
        .expect(HttpStatus.OK);

      expect(response.body.status).toBe(FriendRequestStatus.REJECTED);
    });

    it("should return 403 when trying to update another user's request", async () => {
      const createRes = await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ receiverId: userBId })
        .expect(HttpStatus.CREATED);
      const id = createRes.body.id;

      await request(app.getHttpServer())
        .put(`/api/v1/friendships/${id}`)
        .set(Headers.authorization, `Bearer ${userAToken}`) // sender tries to update
        .send({ status: "ACCEPTED" })
        .expect(HttpStatus.FORBIDDEN);
    });

    it("should return 400 for invalid status", async () => {
      await request(app.getHttpServer())
        .put(`/api/v1/friendships/${pendingId}`)
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .send({ status: "INVALID" })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("should return 401 without token", async () => {
      await request(app.getHttpServer())
        .put(`/api/v1/friendships/${pendingId}`)
        .send({ status: "ACCEPTED" })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe("PATCH /api/v1/friendships/:id", () => {
    let pendingId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ receiverId: userBId })
        .expect(HttpStatus.CREATED);
      pendingId = response.body.id;
    });

    it("should accept a friend request via PATCH", async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/friendships/${pendingId}`)
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .send({ status: "ACCEPTED" })
        .expect(HttpStatus.OK);

      expect(response.body.status).toBe(FriendRequestStatus.ACCEPTED);
    });
  });
});

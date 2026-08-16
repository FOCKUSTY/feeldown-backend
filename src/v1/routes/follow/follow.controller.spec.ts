import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "@/app.module";
import { PrismaService } from "@/database";
import { Headers } from "@/enums";

import request from "supertest";

describe("FollowController (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let userAToken: string;
  let userIdA: string;
  let userBToken: string;
  let userIdB: string;
  let userCToken: string;
  let userIdC: string;

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

    const userA = await createUser("follow_a", "follow_a@example.com");
    userAToken = userA.token;
    userIdA = userA.userId;

    const userB = await createUser("follow_b", "follow_b@example.com");
    userBToken = userB.token;
    userIdB = userB.userId;

    const userC = await createUser("follow_c", "follow_c@example.com");
    userCToken = userC.token;
    userIdC = userC.userId;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe("POST /api/v1/follow", () => {
    it("should create a follow", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/follow")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ followeeId: userIdB })
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject({
        followerId: userIdA,
        followeeId: userIdB,
      });
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("createdAt");
    });

    it("should return 409 if already following", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/follow")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ followeeId: userIdB })
        .expect(HttpStatus.CONFLICT);
    });

    it("should return 400 if followeeId is missing", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/follow")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("should return 403 if trying to follow yourself", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/follow")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ followeeId: userIdA })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("should return 401 without token", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/follow")
        .send({ followeeId: userIdB })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe("GET /api/v1/follow", () => {
    beforeAll(async () => {
      await request(app.getHttpServer())
        .post("/api/v1/follow")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ followeeId: userIdC })
        .expect(HttpStatus.CREATED);
    });

    it("should return list of follows for current user", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/follow")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toMatchObject({
        followerId: userIdA,
      });
    });

    it("should support pagination", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/follow?limit=1&sort=asc&sortBy=createdAt")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
    });

    it("should return 401 without token", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/follow")
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe("GET /api/v1/follow/followers", () => {
    beforeAll(async () => {
      await request(app.getHttpServer())
        .post("/api/v1/follow")
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .send({ followeeId: userIdA })
        .expect(HttpStatus.CREATED);
    });

    it("should return followers of current user", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/follow/followers")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toMatchObject({
        id: userIdB,
        username: "follow_b",
      });
    });

    it("should support pagination", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/follow/followers?limit=1&sort=asc&sortBy=createdAt")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
    });

    it("should return 401 without token", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/follow/followers")
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe("GET /api/v1/follow/following", () => {
    it("should return users current user follows", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/follow/following")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toMatchObject({
        id: userIdC,
        username: "follow_c",
      });
      expect(response.body[1]).toMatchObject({
        id: userIdB,
        username: "follow_b",
      });
    });

    it("should support pagination", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/follow/following?limit=1&sort=asc&sortBy=createdAt")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
    });

    it("should return 401 without token", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/follow/following")
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe("GET /api/v1/follow/:id", () => {
    let followId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/follow")
        .set(Headers.authorization, `Bearer ${userCToken}`)
        .send({ followeeId: userIdA })
        .expect(HttpStatus.CREATED);

      followId = response.body.id;
    });

    it("should return a follow record by id", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/follow/${followId}`)
        .set(Headers.authorization, `Bearer ${userCToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: followId,
        followerId: userIdC,
        followeeId: userIdA,
      });
    });

    it("should return 404 if follow not found", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/follow/00000000-0000-0000-0000-000000000000")
        .set(Headers.authorization, `Bearer ${userCToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it("should return 401 without token", async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/follow/${followId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe("DELETE /api/v1/follow/:id", () => {
    let followId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/follow")
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .send({ followeeId: userIdC })
        .expect(HttpStatus.CREATED);

      followId = response.body.id;
    });

    it("should delete own follow", async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/follow/${followId}`)
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get(`/api/v1/follow/${followId}`)
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it("should return 404 if follow not found", async () => {
      await request(app.getHttpServer())
        .delete("/api/v1/follow/00000000-0000-0000-0000-000000000000")
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it("should return 401 without token", async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/follow/${followId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});

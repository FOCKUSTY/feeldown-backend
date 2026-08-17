import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { AppModule } from "@/app.module";
import { PrismaService } from "@/database";
import { Headers } from "@/enums";

import request from "supertest";

describe("BlockController (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let userAToken: string;
  let userIdA: string;
  let userBToken: string;
  let userIdB: string;
  let userCToken: string;
  let userIdC: string;

  const deleteByUser = async (userId: string, token: string) => {
    return request(app.getHttpServer())
      .delete(`/api/v1/block?userId=${userId}`)
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

    const userA = await createUser("block_a", "block_a@example.com");
    userAToken = userA.token;
    userIdA = userA.userId;

    const userB = await createUser("block_b", "block_b@example.com");
    userBToken = userB.token;
    userIdB = userB.userId;

    const userC = await createUser("block_c", "block_c@example.com");
    userCToken = userC.token;
    userIdC = userC.userId;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe("POST /api/v1/block", () => {
    it("should create a block", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/block")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ blockedId: userIdB })
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject({
        blockerId: userIdA,
        blockedId: userIdB,
      });
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("createdAt");
    });

    it("should return 409 if already blocked", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/block")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ blockedId: userIdB })
        .expect(HttpStatus.CONFLICT);
    });

    it("should return 400 if blockedId is missing", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/block")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("should return 403 if trying to block yourself", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/block")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ blockedId: userIdA })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("should return 401 without token", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/block")
        .send({ blockedId: userIdB })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it("should remove follow and friendship between blocker and blocked", async () => {
      await deleteByUser(userIdB, userAToken);

      await request(app.getHttpServer())
        .post("/api/v1/follow")
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .send({ followeeId: userIdA })
        .expect(HttpStatus.CREATED);

      await request(app.getHttpServer())
        .post("/api/v1/friendships")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ receiverId: userIdB })
        .expect(HttpStatus.CREATED);

      await request(app.getHttpServer())
        .post("/api/v1/block")
        .set(Headers.authorization, `Bearer ${userCToken}`)
        .send({ blockedId: userIdA })
        .expect(HttpStatus.CREATED);

      const followAfter = await prisma.follow.findMany({
        where: {
          OR: [
            { followerId: userIdC, followeeId: userIdA },
            { followerId: userIdA, followeeId: userIdC },
          ],
        },
      });
      expect(followAfter).toHaveLength(0);

      const friendshipAfter = await prisma.friendRequest.findMany({
        where: {
          OR: [
            { senderId: userIdC, receiverId: userIdA },
            { senderId: userIdA, receiverId: userIdC },
          ],
        },
      });
      expect(friendshipAfter).toHaveLength(0);
    });
  });

  describe("GET /api/v1/block", () => {
    beforeAll(async () => {
      await request(app.getHttpServer())
        .post("/api/v1/block")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ blockedId: userIdC })
        .expect(HttpStatus.CREATED);
    });

    it("should return list of blocks for current user", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/block")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toMatchObject({
        blockerId: userIdA,
      });
    });

    it("should support pagination", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/block?limit=1&sort=asc&sortBy=createdAt")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
    });

    it("should return 401 without token", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/block")
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe("GET /api/v1/block/:id", () => {
    let blockId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/block")
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .send({ blockedId: userIdA })
        .expect(HttpStatus.CREATED);

      blockId = response.body.id;
    });

    it("should return a block record by id", async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/block/${blockId}`)
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: blockId,
        blockerId: userIdB,
        blockedId: userIdA,
      });
    });

    it("should return 404 if block not found", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/block/00000000-0000-0000-0000-000000000000")
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it("should return 401 without token", async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/block/${blockId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe("DELETE /api/v1/block/:id", () => {
    let blockId: string;

    beforeAll(async () => {
      await deleteByUser(userIdA, userCToken);

      const response = await request(app.getHttpServer())
        .post("/api/v1/block")
        .set(Headers.authorization, `Bearer ${userCToken}`)
        .send({ blockedId: userIdA })
        .expect(HttpStatus.CREATED);

      blockId = response.body.id;
    });

    it("should delete own block", async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/block/${blockId}`)
        .set(Headers.authorization, `Bearer ${userCToken}`)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get(`/api/v1/block/${blockId}`)
        .set(Headers.authorization, `Bearer ${userCToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it("should return 404 if block not found", async () => {
      await request(app.getHttpServer())
        .delete("/api/v1/block/00000000-0000-0000-0000-000000000000")
        .set(Headers.authorization, `Bearer ${userCToken}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it("should return 401 without token", async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/block/${blockId}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it("should not allow deletion by non-blocker", async () => {
      const newBlock = await request(app.getHttpServer())
        .post("/api/v1/block")
        .set(Headers.authorization, `Bearer ${userAToken}`)
        .send({ blockedId: userIdB })
        .expect(HttpStatus.CREATED);

      await request(app.getHttpServer())
        .delete(`/api/v1/block/${newBlock.body.id}`)
        .set(Headers.authorization, `Bearer ${userBToken}`)
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});

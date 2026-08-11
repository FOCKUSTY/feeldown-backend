import type { ServerUser } from "@1/types";

import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";

import request from "supertest";

import { AppModule } from "@/app.module";
import { PrismaService } from "@/database";

import { Headers } from "@/enums";

describe("AuthController (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  let me: ServerUser;
  describe("POST /api/v1/auth/", () => {
    it("should register a new user", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/v1/auth/")
        .set(Headers.email, "fockusty@example.com")
        .set(Headers.password, "FOCKUSTY SECRET")
        .send({ username: "fockusty", nickname: "FOCKUSTY" })
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject({
        auth: expect.objectContaining({
          email: "fockusty@example.com",
          token: expect.any(String),
        }),
        user: expect.objectContaining({
          username: "fockusty",
          nickname: "FOCKUSTY",
        }),
      });

      me = response.body;
    });

    it("should fail with 409 if username already exists", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/")
        .set(Headers.email, "another@example.com")
        .set(Headers.password, "pass123")
        .send({ username: "fockusty" })
        .expect(HttpStatus.CONFLICT);
    });

    it("should fail with 400 if username contains invalid symbols", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/")
        .set(Headers.email, "test2@example.com")
        .set(Headers.password, "pass123")
        .send({ username: "invalid user!" })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("should fail with 400 if password missing", async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/")
        .send({ username: "anyuser" })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /api/v1/auth/@me", () => {
    beforeAll(async () => {
      await request(app.getHttpServer())
        .post("/api/v1/auth/")
        .set(Headers.password, `SUPER SECRET`)
        .send({ username: "meuser", nickname: "Me" })
        .expect(HttpStatus.CREATED);
    });

    it("should return current user data with valid token", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/auth/@me")
        .set(Headers.authorization, `Bearer ${me.auth.token}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        auth: expect.objectContaining({ token: me.auth.token }),
        user: expect.objectContaining({ username: "fockusty" }),
      });
    });

    it("should return 401 if no token provided", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/auth/@me")
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it("should return 400 if invalid token provided", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/auth/@me")
        .set(Headers.authorization, "Bearer invalid.token.here")
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});

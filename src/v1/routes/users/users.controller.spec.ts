import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";

import { AppModule } from "@/app.module";
import { PrismaService } from "@/database";

import request from "supertest";

describe("UsersController (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;

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
      prisma.comment.deleteMany(),
      prisma.post.deleteMany(),
      prisma.service.deleteMany(),
      prisma.auth.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    const response = await request(app.getHttpServer())
      .post("/api/v1/auth/")
      .set("email", "test@example.com")
      .set("password", "secret")
      .send({ username: "testuser", nickname: "Tester" });

    authToken = response.body.auth.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe("GET /api/v1/users/:slug", () => {
    it("should return user by slug @username", async () => {
      const response = await request(app.getHttpServer())
        .get("/api/v1/users/@testuser")
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        username: "testuser",
        nickname: "Tester",
      });
    });

    it("should return 404 if user not found", async () => {
      await request(app.getHttpServer())
        .get("/api/v1/users/@unknown")
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe("PUT /api/v1/users/:slug", () => {
    it("should update own profile", async () => {
      const response = await request(app.getHttpServer())
        .put("/api/v1/users/@testuser")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ nickname: "UpdatedName" })
        .expect(HttpStatus.OK);

      expect(response.body.nickname).toBe("UpdatedName");
    });

    it("should reject if not owner", async () => {
      const responseTwo = await request(app.getHttpServer())
        .post("/api/v1/auth/")
        .set("email", "other@example.com")
        .set("Content-Type", "application/json")
        .set("password", "secret")
        .send({ username: "other", nickname: "Other" });
      const token = responseTwo.body.auth.token;

      await request(app.getHttpServer())
        .put("/api/v1/users/@testuser")
        .set("Authorization", `Bearer ${token}`)
        .send({ nickname: "Hack" })
        .expect(HttpStatus.FORBIDDEN);
    });
  });
});

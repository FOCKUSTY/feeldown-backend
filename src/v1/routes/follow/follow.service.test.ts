import { Test, TestingModule } from "@nestjs/testing";

import { FollowService } from "./follow.service";
import { FollowValidator } from "./follow.validator";

import { RelationshipsValidatorService } from "@1/services";
import { PrismaService } from "@/database";
import { FOLLOW_ERRORS } from "@1/errors";

import { v7 as uuid } from "uuid";

describe("FollowService", () => {
  let service: FollowService;
  let prismaMock: any;
  let validatorMock: any;

  const userIdA = uuid();
  const userIdB = uuid();

  const mockFollow = {
    id: uuid(),
    followerId: userIdA,
    followeeId: userIdB,
    createdAt: new Date(),
  };

  beforeEach(async () => {
    prismaMock = {
      follow: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    validatorMock = {
      validateCreate: jest.fn().mockResolvedValue(true),
      validateDelete: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: FollowValidator, useValue: validatorMock },
        {
          provide: RelationshipsValidatorService,
          useValue: { isBlockedOrThrow: jest.fn().mockResolvedValue(false) },
        },
      ],
    }).compile();

    service = module.get<FollowService>(FollowService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getFollowers", () => {
    it("should return list of followers for a user", async () => {
      const filter = {
        sort: "asc" as const,
        limit: 10,
        sortBy: "createdAt" as const,
      };

      const follows = [
        { follower: { id: userIdB, username: "userB" } },
        { follower: { id: uuid(), username: "userC" } },
      ];

      prismaMock.follow.findMany.mockResolvedValue(follows);

      const result = await service.getFollowers(filter, userIdA);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("username");
      expect(prismaMock.follow.findMany).toHaveBeenCalledWith({
        where: { followeeId: userIdA },
        select: { follower: true },
        orderBy: { createdAt: "asc" },
        skip: 0,
        take: 10,
        cursor: undefined,
      });
    });

    it("should use default sort if not provided", async () => {
      const filter = {
        sort: "asc" as const,
        limit: 10,
        sortBy: "createdAt" as const,
      };

      prismaMock.follow.findMany.mockResolvedValue([]);

      await service.getFollowers(filter, userIdA);

      expect(prismaMock.follow.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { createdAt: "asc" },
        }),
      );
    });
  });

  describe("getFollowing", () => {
    it("should return list of users followed by a user", async () => {
      const filter = {
        sort: "desc" as const,
        limit: 5,
        sortBy: "createdAt" as const,
      };

      const follows = [
        { followee: { id: userIdB, username: "userB" } },
        { followee: { id: uuid(), username: "userD" } },
      ];

      prismaMock.follow.findMany.mockResolvedValue(follows);

      const result = await service.getFollowing(filter, userIdA);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("id");
      expect(prismaMock.follow.findMany).toHaveBeenCalledWith({
        where: { followerId: userIdA },
        select: { followee: true },
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 5,
        cursor: undefined,
      });
    });
  });

  describe("deleteByUsers", () => {
    it("should delete follows between two users", async () => {
      prismaMock.follow.deleteMany.mockResolvedValue({ count: 2 });

      const result = await service.deleteByUsers(userIdA, userIdB);

      expect(result).toEqual({ count: 2 });
      expect(prismaMock.follow.deleteMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { followerId: userIdA, followeeId: userIdB },
            { followerId: userIdB, followeeId: userIdA },
          ],
        },
      });
    });

    it("should return count 0 if no follows exist", async () => {
      prismaMock.follow.deleteMany.mockResolvedValue({ count: 0 });

      const result = await service.deleteByUsers(userIdA, userIdB);

      expect(result).toEqual({ count: 0 });
    });
  });

  describe("create (via CrudService)", () => {
    it("should call validator on create", async () => {
      const createData = {
        followerId: userIdA,
        followeeId: userIdB,
      };

      prismaMock.follow.create.mockResolvedValue(mockFollow);

      await service.create(createData);

      expect(validatorMock.validateCreate).toHaveBeenCalledWith(createData);
      expect(prismaMock.follow.create).toHaveBeenCalledWith({
        data: createData,
      });
    });

    it("should throw if validator rejects", async () => {
      validatorMock.validateCreate.mockRejectedValue(
        FOLLOW_ERRORS.ALREADY_FOLLOWING.execute(),
      );

      await expect(
        service.create({
          followerId: userIdA,
          followeeId: userIdB,
        }),
      ).rejects.toThrow();
    });
  });

  describe("delete (via CrudService)", () => {
    it("should call validator on delete", async () => {
      const deleteData = {
        where: { id: mockFollow.id },
        meUserId: userIdA,
      };

      prismaMock.follow.delete.mockResolvedValue(mockFollow);

      await service.delete(deleteData);

      expect(validatorMock.validateDelete).toHaveBeenCalledWith(deleteData);
      expect(prismaMock.follow.delete).toHaveBeenCalledWith({
        where: { id: mockFollow.id },
      });
    });

    it("should throw if validator rejects", async () => {
      validatorMock.validateDelete.mockRejectedValue(
        FOLLOW_ERRORS.NOT_FOLLOWER.execute(),
      );

      await expect(
        service.delete({
          where: { id: mockFollow.id },
          meUserId: userIdB,
        }),
      ).rejects.toThrow();
    });
  });
});

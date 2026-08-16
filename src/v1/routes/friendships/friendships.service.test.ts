import type { FriendRequest } from "@1/types";
import { Test, TestingModule } from "@nestjs/testing";

import { FriendshipsService } from "./friendships.service";
import { FriendshipNotificationsEmitter } from "../notifications";

import { FriendRequestStatus } from "@1/types";
import { PrismaService } from "@/database";
import { v7 as uuid } from "uuid";

describe("FriendshipsService", () => {
  let service: FriendshipsService;
  let prismaMock: any;
  let emitterMock: any;

  const userIdA = uuid();
  const userIdB = uuid();
  const userIdC = uuid();

  const mockFriendRequest: FriendRequest = {
    id: uuid(),
    senderId: userIdA,
    receiverId: userIdB,
    status: FriendRequestStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    prismaMock = {
      friendRequest: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
        count: jest.fn(),
      },
    };

    emitterMock = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendshipsService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: FriendshipNotificationsEmitter, useValue: emitterMock },
      ],
    }).compile();

    service = module.get<FriendshipsService>(FriendshipsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getUsers", () => {
    it("should return list of friends for a user", async () => {
      const filter = {
        sort: "asc" as const,
        limit: 10,
        sortBy: "createdAt" as const,
      };

      const friendships = [
        {
          sender: { id: userIdA, username: "a" },
          receiver: { id: userIdB, username: "b" },
        },
        {
          sender: { id: userIdC, username: "c" },
          receiver: { id: userIdA, username: "a" },
        },
      ];

      prismaMock.friendRequest.findMany.mockResolvedValue(friendships);

      const result = await service.getUsers(filter, userIdA);

      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: userIdB, username: "b" },
        { id: userIdC, username: "c" },
      ]);
      expect(prismaMock.friendRequest.findMany).toHaveBeenCalledWith({
        where: {
          status: FriendRequestStatus.ACCEPTED,
          OR: [{ senderId: userIdA }, { receiverId: userIdA }],
        },
        cursor: undefined,
        include: undefined,
        omit: undefined,
        select: { sender: true, receiver: true },
        orderBy: {
          createdAt: "asc",
        },
        skip: 0,
        take: 10,
      });
    });

    it("should use default status ACCEPTED if not provided", async () => {
      const filter = {
        sort: "asc" as const,
        limit: 10,
        sortBy: "createdAt" as const,
      };

      prismaMock.friendRequest.findMany.mockResolvedValue([]);

      await service.getUsers(filter, userIdA);

      expect(prismaMock.friendRequest.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: FriendRequestStatus.ACCEPTED,
          }),
        }),
      );
    });
  });

  describe("deleteByUsers", () => {
    it("should delete friend requests between two users", async () => {
      prismaMock.friendRequest.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.deleteByUsers(userIdA, userIdB);

      expect(result).toEqual({ count: 1 });
      expect(prismaMock.friendRequest.deleteMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { senderId: userIdA, receiverId: userIdB },
            { senderId: userIdB, receiverId: userIdA },
          ],
        },
      });
    });
  });

  describe("create (via CrudService)", () => {
    it("should call emitter on create with PENDING status", async () => {
      const createData = {
        senderId: userIdA,
        receiverId: userIdB,
      };

      const createdRequest = {
        ...mockFriendRequest,
        status: FriendRequestStatus.PENDING,
      };

      prismaMock.friendRequest.create.mockResolvedValue(createdRequest);
      const result = await service.create(createData);

      expect(result.status).toBe(FriendRequestStatus.PENDING);
      expect(emitterMock.execute).toHaveBeenCalledWith(
        createdRequest,
        FriendRequestStatus.PENDING,
      );
    });
  });

  describe("update (via CrudService)", () => {
    it("should call emitter on update when status becomes ACCEPTED", async () => {
      const updatedRequest = {
        ...mockFriendRequest,
        status: FriendRequestStatus.ACCEPTED,
      };

      prismaMock.friendRequest.update.mockResolvedValue(updatedRequest);

      const result = await service.update({
        where: { id: mockFriendRequest.id },
        data: { status: FriendRequestStatus.ACCEPTED },
        meUserId: userIdA,
      });

      expect(result.status).toBe(FriendRequestStatus.ACCEPTED);
      expect(emitterMock.execute).toHaveBeenCalledWith(
        updatedRequest,
        FriendRequestStatus.ACCEPTED,
      );
    });

    it("should NOT call emitter when status is REJECTED", async () => {
      const updatedRequest = {
        ...mockFriendRequest,
        status: FriendRequestStatus.REJECTED,
      };

      prismaMock.friendRequest.update.mockResolvedValue(updatedRequest);

      const result = await service.update({
        where: { id: mockFriendRequest.id },
        data: { status: FriendRequestStatus.REJECTED },
        meUserId: userIdA,
      });

      expect(result.status).toBe(FriendRequestStatus.REJECTED);
      expect(emitterMock.execute).not.toHaveBeenCalled();
    });
  });

  describe("getOne (via CrudService)", () => {
    it("should add OR condition to where clause", async () => {
      const request = {
        where: { id: mockFriendRequest.id },
        meUserId: userIdA,
      };

      prismaMock.friendRequest.findUnique.mockResolvedValue(mockFriendRequest);

      await service.getOne(request);

      expect(prismaMock.friendRequest.findUnique).toHaveBeenCalledWith({
        where: {
          id: mockFriendRequest.id,
          OR: [{ senderId: userIdA }, { receiverId: userIdA }],
        },
      });
    });
  });
});

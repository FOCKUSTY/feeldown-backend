import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { PrismaService } from "@/database";

describe("UsersService", () => {
  let service: UsersService;

  const mockUser = {
    id: "user-1",
    username: "test",
    nickname: "Test",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getOne", () => {
    it("should return a user by id", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getOne({ id: "user-1" });
      expect(result).toEqual(mockUser);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "user-1" },
      });
    });

    it("should throw if user not found", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getOne({ id: "not-exist" })).rejects.toThrow();
    });
  });

  describe("update", () => {
    it("should update user", async () => {
      const updateData = { nickname: "NewName" };
      mockPrisma.user.update.mockResolvedValue({ ...mockUser, ...updateData });

      const result = await service.update({
        where: { id: "user-1" },
        data: updateData,
      });
      expect(result.nickname).toBe("NewName");
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-1" },
        data: updateData,
      });
    });
  });
});

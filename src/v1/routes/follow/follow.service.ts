import type { FollowCreateDto } from "./dto";
import type { Follow } from "@1/types";

import { Injectable, HttpException, HttpStatus } from "@nestjs/common";

import { CrudService, RelationshipService } from "@1/services";
import { PrismaService } from "@/database";

@Injectable()
export class FollowService extends CrudService<"Follow"> {
  public constructor(
    protected readonly prisma: PrismaService,
    private readonly relationships: RelationshipService,
  ) {
    super(prisma.follow);
  }

  public async create(
    data: FollowCreateDto & { followerId: string },
  ): Promise<Follow> {
    const { followerId, followeeId } = data;

    if (followerId === followeeId) {
      throw new HttpException(
        "You cannot follow yourself",
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.relationships.isBlockedOrThrow(followeeId, followerId);

    const existing = await this.prisma.follow.findUnique({
      where: {
        followerId_followeeId: {
          followerId,
          followeeId,
        },
      },
    });

    if (existing) {
      throw new HttpException("Follow already exists", HttpStatus.CONFLICT);
    }

    return this.prisma.follow.create({ data });
  }

  public async delete(where: { id: string }, userId: string): Promise<Follow> {
    const follow = await this.prisma.follow.findUnique({ where });
    if (!follow) {
      throw new HttpException("Follow not found", HttpStatus.NOT_FOUND);
    }

    if (follow.followerId !== userId) {
      throw new HttpException("You are not the follower", HttpStatus.FORBIDDEN);
    }

    return this.prisma.follow.delete({ where });
  }

  public async deleteByUsers(userA: string, userB: string) {
    return this.prisma.follow.deleteMany({
      where: {
        OR: [
          { followerId: userA, followeeId: userB },
          { followerId: userB, followeeId: userA },
        ],
      },
    });
  }
}

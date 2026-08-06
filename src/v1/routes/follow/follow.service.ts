import type { FollowCreateDto } from "./dto";
import type { Follow } from "@1/types";

import { Injectable } from "@nestjs/common";

import { CrudService, RelationshipService } from "@1/services";
import { PrismaService } from "@/database";
import { FOLLOW_ERRORS } from "@1/errors";

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
      throw FOLLOW_ERRORS.CANNOT_FOLLOW_SELF.exception;
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
      throw FOLLOW_ERRORS.ALREADY_FOLLOWING.execute();
    }

    return this.prisma.follow.create({ data });
  }

  public async delete(where: { id: string }, userId: string): Promise<Follow> {
    const follow = await this.prisma.follow.findUnique({ where });
    if (!follow) {
      throw FOLLOW_ERRORS.FOLLOW_NOT_FOUND.execute();
    }

    if (follow.followerId !== userId) {
      throw FOLLOW_ERRORS.NOT_FOLLOWER.execute();
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

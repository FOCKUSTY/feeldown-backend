import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database";
import { RELATIONSHIPS_ERRORS } from "@1/errors";

@Injectable()
export class RelationshipService {
  public constructor(private readonly prisma: PrismaService) {}

  public async isBlockedOrThrow(userA: string, userB: string) {
    const block = await this.prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: userA, blockedId: userB },
          { blockerId: userB, blockedId: userA },
        ],
      },
    });

    if (block) {
      if (block.blockerId === userA) {
        throw RELATIONSHIPS_ERRORS.USER_BLOCKED.exception;
      }

      throw RELATIONSHIPS_ERRORS.BLOCKED_BY_USER.exception;
    }

    return false;
  }

  public async hasFollow(followerId: string, followeeId: string) {
    const follow = await this.prisma.follow.findUnique({
      where: {
        followerId_followeeId: {
          followerId,
          followeeId,
        },
      },
    });

    return follow;
  }

  public async hasBlock(blockerId: string, blockedId: string) {
    const block = await this.prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId,
        },
      },
    });

    return block;
  }
}

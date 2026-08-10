import type {
  CrudValidator,
  FollowCreateInput,
  FollowDeleteInput,
} from "@1/types";

import { Injectable } from "@nestjs/common";

import { RelationshipsValidatorService } from "@1/services";
import { PrismaService } from "@/database";
import { FOLLOW_ERRORS } from "@1/errors";

@Injectable()
export class FollowValidator implements CrudValidator<"create" | "delete"> {
  public constructor(
    private readonly relationships: RelationshipsValidatorService,
    private readonly prisma: PrismaService,
  ) {}

  public async validateCreate(data: FollowCreateInput): Promise<true> {
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

    return true;
  }

  public async validateDelete({
    where,
    meUserId,
  }: FollowDeleteInput): Promise<true> {
    const follow = await this.prisma.follow.findUnique({ where });
    if (!follow) {
      throw FOLLOW_ERRORS.FOLLOW_NOT_FOUND.execute();
    }

    if (follow.followerId !== meUserId) {
      throw FOLLOW_ERRORS.NOT_FOLLOWER.execute();
    }

    return true;
  }
}

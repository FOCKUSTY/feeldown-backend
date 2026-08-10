import type {
  FollowCreateInput,
  FollowDeleteInput,
  FollowFilter,
  User,
} from "@1/types";

import { Injectable } from "@nestjs/common";

import { CrudService } from "@1/services";
import { PrismaService } from "@/database";

import { FollowValidator } from "./follow.validator";

@Injectable()
export class FollowService extends CrudService<
  "Follow",
  {
    create: FollowCreateInput;
    delete: FollowDeleteInput;
  }
> {
  public constructor(
    protected readonly prisma: PrismaService,
    validator: FollowValidator,
  ) {
    super(prisma.follow, {
      modificators: {
        where: {
          delete: (data) => data.where,
        },
      },
      validatorsOrThrow: validator,
    });
  }

  public async getFollowers(
    filter: FollowFilter,
    userId: string,
  ): Promise<User[]> {
    return this.getRelated({
      filter,
      where: { followeeId: userId },
      selectField: "follower",
    });
  }

  public async getFollowing(
    filter: FollowFilter,
    userId: string,
  ): Promise<User[]> {
    return this.getRelated({
      filter,
      where: { followerId: userId },
      selectField: "followee",
    });
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

import type {
  FollowCreateInput,
  FollowDeleteInput,
  FollowFilter,
  User,
} from "@1/types";

import { EventEmitter2 as EventEmitter } from "@nestjs/event-emitter";
import { Injectable } from "@nestjs/common";

import { Events } from "@1/enums";
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
    emitter: EventEmitter,
  ) {
    super(prisma.follow, {
      modificators: {
        where: {
          delete: (data) => data.where,
        },
      },
      validatorsOrThrow: validator,
      events: {
        afterCreate: async (input) => {
          emitter.emit(Events.FOLLOW_CREATED, input.result);
        },
      },
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

  public async deleteByUser(followerId: string, followeeId: string) {
    return this.prisma.follow.deleteMany({
      where: {
        followerId,
        followeeId,
      },
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

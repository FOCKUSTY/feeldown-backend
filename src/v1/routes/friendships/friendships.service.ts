import type { FriendshipUpdateDto, FriendshipCreateDto } from "./dto";
import type { FriendshipFilter } from "@1/types";
import type { User } from "@1/entities";

import { Injectable } from "@nestjs/common";

import { Compare, CompareAdditional, CrudService } from "@1/services";
import { FriendRequestStatus } from "@1/types";
import { PrismaService } from "@/database";

@Injectable()
export class FriendshipsService extends CrudService<
  "FriendRequest",
  Compare<
    "FriendRequest",
    {
      getOne: { id: string };
      create: FriendshipCreateDto & { senderId: string };
      update: [{ id: string }, FriendshipUpdateDto];
    }
  >,
  CompareAdditional<{
    getOne: [string];
    update: [string];
  }>
> {
  public constructor(protected readonly prisma: PrismaService) {
    super(prisma.friendRequest, {
      where: {
        getOne: (where, [userId]) => this.getWhere(where, userId),
        update: ([where], [userId]) => this.getWhere(where, userId),
      },
    });
  }

  public async getUsers(
    filter: FriendshipFilter,
    userId: string,
  ): Promise<User[]> {
    const friendships = await this.prisma.friendRequest.findMany({
      where: {
        status: filter.status || FriendRequestStatus.ACCEPTED,
        OR: this.getOr(userId),
      },
      orderBy: {
        [filter.sortBy]: filter.sort,
      },
      include: {
        receiver: true,
        sender: true,
      },
    });

    const friends = friendships.map(({ receiver, sender }) => {
      if (sender.id === userId) {
        return sender;
      }

      return receiver;
    });

    return friends;
  }

  private getWhere(where: { id: string }, userId: string) {
    return {
      ...where,
      OR: this.getOr(userId),
    };
  }

  private getOr(userId: string) {
    return [
      {
        senderId: userId,
      },
      {
        receiverId: userId,
      },
    ];
  }
}

export default FriendshipsService;

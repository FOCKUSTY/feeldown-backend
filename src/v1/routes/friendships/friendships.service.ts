import type { FriendshipUpdateDto, FriendshipCreateDto } from "./dto";
import type { User } from "@1/entities";
import type { FriendRequest, FriendshipFilter } from "@1/types";

import { Injectable } from "@nestjs/common";

import { FriendRequestStatus } from "@1/types";
import { PrismaService } from "@/database";
import { CrudService } from "@1/services";
import { protectEvents } from "@1/utils";

import { FriendshipNotificationsEmitter } from "../notifications";

@Injectable()
export class FriendshipsService extends CrudService<
  "FriendRequest",
  {
    getOne: { where: { id: string }; meUserId: string };
    create: FriendshipCreateDto & { senderId: string };
    update: {
      where: { id: string };
      data: FriendshipUpdateDto;
      meUserId: string;
    };
  }
> {
  public constructor(
    protected readonly prisma: PrismaService,
    private readonly emitter: FriendshipNotificationsEmitter,
  ) {
    super(prisma.friendRequest, {
      modificators: {
        where: {
          getOne: (input) => this.getWhere(input),
          update: (input) => this.getWhere(input),
        },
      },
      events: protectEvents({
        create: ({ result }) => this.onCreate(result),
        update: ({ result }) => this.onUpdate(result),
      }),
    });
  }

  public async getUsers(
    filter: FriendshipFilter,
    userId: string,
  ): Promise<User[]> {
    const friendships = await this.get({
      ...filter,
      where: {
        status: filter.status || FriendRequestStatus.ACCEPTED,
        OR: this.getOr(userId),
      },
      select: {
        sender: true,
        receiver: true,
      },
    });

    const users = friendships.map(({ receiver, sender }) => {
      if (sender.id === userId) {
        return sender;
      }

      return receiver;
    });

    return users;
  }

  public async deleteByUsers(userA: string, userB: string) {
    return this.prisma.friendRequest.deleteMany({
      where: {
        OR: [
          { senderId: userA, receiverId: userB },
          { senderId: userB, receiverId: userA },
        ],
      },
    });
  }

  protected onCreate(request: FriendRequest) {
    return this.emitter.execute(request, FriendRequestStatus.PENDING);
  }

  protected onUpdate(request: FriendRequest) {
    if (request.status !== FriendRequestStatus.ACCEPTED) {
      return null;
    }

    return this.emitter.execute(request, FriendRequestStatus.ACCEPTED);
  }

  private getWhere<W, T extends { meUserId: string; where: W }>(input: T) {
    const { meUserId, where } = input;
    return {
      ...where,
      OR: this.getOr(meUserId),
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

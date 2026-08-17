import type { FriendshipUpdateDto, FriendshipCreateDto } from "./dto";
import type { FriendshipFilter } from "@1/types";
import type { User } from "@1/entities";

import { HttpException, Injectable } from "@nestjs/common";

import { FriendRequestStatus } from "@1/types";
import { PrismaService } from "@/database";
import { CrudService } from "@1/services";
import { Events } from "@1/enums";

import { EventEmitter2 as EventEmitter } from "@nestjs/event-emitter";

@Injectable()
export class FriendshipsService extends CrudService<
  "FriendRequest",
  {
    getOne: { where: { id: string }; meUserId: string };
    create: FriendshipCreateDto & { senderId: string };
    delete: { where: { id: string }; meUserId: string };
    update: {
      where: { id: string };
      data: FriendshipUpdateDto;
      meUserId: string;
    };
  }
> {
  public constructor(
    protected readonly prisma: PrismaService,
    emitter: EventEmitter,
  ) {
    super(prisma.friendRequest, {
      modificators: {
        where: {
          getOne: (input) => this.getWhere(input),
          update: (input) => this.getWhere(input),
          delete: (input) => this.getWhere(input),
        },
      },
      events: {
        afterCreate: async ({ result }) => {
          emitter.emit(Events.FRIENDSHIP_REQUEST_CREATED, result);
        },
        afterUpdate: async ({ result }) => {
          emitter.emit(Events.FRIENDSHIP_REQUEST_UPDATED, result);
        },
      },
      validatorsOrThrow: {
        validateCreate: async (input) => {
          if (input.receiverId === input.senderId) {
            throw new HttpException("Can not friend yourself", 400);
          }

          return true;
        },
      },
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
      if (sender.id !== userId) {
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

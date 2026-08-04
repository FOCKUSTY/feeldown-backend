import type { FriendRequest, FriendshipFilter } from "@1/types";
import type { User } from "@1/entities";

import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database";

import { FriendRequestStatus } from "@1/types";
import { FriendshipUpdateDto, FriendshipCreateDto } from "./dto";

@Injectable()
export class FriendshipsService {
  public constructor(private readonly prisma: PrismaService) {}

  public async get(filter: FriendshipFilter, userId: string): Promise<User[]> {
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

  public async getOne(
    id: string,
    userId: string,
  ): Promise<FriendRequest | null> {
    return this.prisma.friendRequest.findUnique({
      where: this.getWhere(id, userId),
    });
  }

  public async post(
    data: FriendshipCreateDto,
    userId: string,
  ): Promise<FriendRequest> {
    return this.prisma.friendRequest.create({
      data: {
        receiverId: data.receiverId,
        senderId: userId,
      },
    });
  }

  public async update(
    id: string,
    data: FriendshipUpdateDto,
    userId: string,
  ): Promise<FriendRequest> {
    return this.prisma.friendRequest.update({
      where: this.getWhere(id, userId),
      data: {
        status: data.status,
      },
    });
  }

  public async patch(
    id: string,
    data: FriendshipUpdateDto,
    userId: string,
  ): Promise<FriendRequest> {
    return this.update(id, data, userId);
  }

  private getWhere(id: string, userId: string) {
    return {
      id,
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

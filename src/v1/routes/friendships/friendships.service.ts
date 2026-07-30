import type { FriendRequest, FriendshipFilter } from "@1/types";
import type { User } from "@1/entities";

import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database";
import { FriendRequestStatus } from "@1/types";
import { FriendshipCreateDto } from "./dto/friendship-create.dto";
import { FriendshipUpdateDto } from "./dto";

@Injectable()
export class FriendshipsService {
  public constructor(private readonly prisma: PrismaService) {}

  public async get(filter: FriendshipFilter, userId: string): Promise<User[]> {
    const friendships = await this.prisma.friendRequest.findMany({
      where: {
        status: filter.status || FriendRequestStatus.ACCEPTED,
        OR: [{ receiverId: userId }, { senderId: userId }],
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

  public async getOne(id: string): Promise<FriendRequest | null> {
    return this.prisma.friendRequest.findUnique({ where: { id } });
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

  public async put(
    id: string,
    data: FriendshipUpdateDto,
  ): Promise<FriendRequest> {
    return this.prisma.friendRequest.update({
      where: {
        id,
      },
      data: {
        status: data.status,
      },
    });
  }

  public async patch(
    id: string,
    data: FriendshipUpdateDto,
  ): Promise<FriendRequest> {
    return this.put(id, data);
  }
}

export default FriendshipsService;

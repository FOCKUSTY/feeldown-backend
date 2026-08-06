import type { BlockCreateDto } from "./dto";
import type { Block } from "@1/types";

import { Injectable, HttpException, HttpStatus } from "@nestjs/common";

import { CrudService } from "@1/services";
import { PrismaService } from "@/database";

import { FollowService } from "../follow";
import { FriendshipsService } from "../friendships";

@Injectable()
export class BlockService extends CrudService<"Block"> {
  public constructor(
    protected readonly prisma: PrismaService,
    private readonly followService: FollowService,
    private readonly friendshipsService: FriendshipsService,
  ) {
    super(prisma.block);
  }

  public async create(
    data: BlockCreateDto & { blockerId: string },
  ): Promise<Block> {
    const { blockerId, blockedId } = data;

    if (blockerId === blockedId) {
      throw new HttpException(
        "You cannot block yourself",
        HttpStatus.BAD_REQUEST,
      );
    }

    const existing = await this.prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId,
        },
      },
    });

    if (existing) {
      throw new HttpException("Block already exists", HttpStatus.CONFLICT);
    }

    await this.followService.deleteByUsers(blockerId, blockedId);
    await this.friendshipsService.deleteByUsers(blockerId, blockedId);

    return this.prisma.block.create({ data });
  }

  public async delete(where: { id: string }, userId: string): Promise<Block> {
    const block = await this.prisma.block.findUnique({ where });
    if (!block) {
      throw new HttpException("Block not found", HttpStatus.NOT_FOUND);
    }

    if (block.blockerId !== userId) {
      throw new HttpException("You are not the blocker", HttpStatus.FORBIDDEN);
    }

    return this.prisma.block.delete({ where });
  }
}

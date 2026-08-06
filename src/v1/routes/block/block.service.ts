import type { BlockCreateDto } from "./dto";
import type { Block } from "@1/types";

import { Injectable } from "@nestjs/common";

import { CrudService } from "@1/services";
import { PrismaService } from "@/database";

import { FollowService } from "../follow";
import { FriendshipsService } from "../friendships";
import { BLOCK_ERRORS } from "@1/errors";

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
      throw BLOCK_ERRORS.CANNOT_BLOCK_SELF.exception;
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
      throw BLOCK_ERRORS.ALREADY_BLOCKED.exception;
    }

    await this.followService.deleteByUsers(blockerId, blockedId);
    await this.friendshipsService.deleteByUsers(blockerId, blockedId);

    return this.prisma.block.create({ data });
  }

  public async delete(where: { id: string }, userId: string): Promise<Block> {
    const block = await this.prisma.block.findUnique({ where });
    if (!block) {
      throw BLOCK_ERRORS.BLOCK_NOT_FOUND.exception;
    }

    if (block.blockerId !== userId) {
      throw BLOCK_ERRORS.NOT_BLOCKER.exception;
    }

    return this.prisma.block.delete({ where });
  }
}

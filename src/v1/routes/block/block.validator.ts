import type {
  BlockCreateInput,
  BlockDeleteInput,
  CrudValidator,
} from "@1/types";

import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database";
import { BLOCK_ERRORS } from "@1/errors";

@Injectable()
export class BlockValidator implements CrudValidator<"create" | "delete"> {
  public constructor(private readonly prisma: PrismaService) {}

  public async validateCreate(data: BlockCreateInput): Promise<true> {
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

    return true;
  }

  public async validateDelete({
    where,
    meUserId,
  }: BlockDeleteInput): Promise<true> {
    const block = await this.prisma.block.findUnique({ where });
    if (!block) {
      throw BLOCK_ERRORS.BLOCK_NOT_FOUND.exception;
    }

    if (block.blockerId !== meUserId) {
      throw BLOCK_ERRORS.NOT_BLOCKER.exception;
    }

    return true;
  }
}

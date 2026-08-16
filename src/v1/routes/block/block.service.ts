import type { BlockCreateInput, BlockDeleteInput } from "@1/types";

import { Injectable } from "@nestjs/common";

import { CrudService } from "@1/services";
import { PrismaService } from "@/database";

import { BlockValidator } from "./block.validator";
import { BlockListener } from "./block.listener";

@Injectable()
export class BlockService extends CrudService<
  "Block",
  {
    create: BlockCreateInput;
    delete: BlockDeleteInput;
  }
> {
  public constructor(
    protected readonly prisma: PrismaService,
    validator: BlockValidator,
    events: BlockListener,
  ) {
    super(prisma.block, {
      modificators: {
        where: {
          delete: (data) => data.where,
        },
      },
      validatorsOrThrow: validator,
      events: {
        beforeCreate: (input) => events.beforeCreate(input.base),
      },
    });
  }
}

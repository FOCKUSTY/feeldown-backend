import { Module } from "@nestjs/common";

import { BlockController } from "./block.controller";
import { BlockService } from "./block.service";

import { PrismaService } from "@/database";
import { AUTH_GUARD_PROVIDERS, ONLY_ME_GUARD_PROVIDERS } from "@1/guards";
import { SERVER_USER_PROVIDERS } from "@1/services";

@Module({
  controllers: [BlockController],
  providers: [
    BlockService,
    PrismaService,
    ...AUTH_GUARD_PROVIDERS,
    ...ONLY_ME_GUARD_PROVIDERS,
    ...SERVER_USER_PROVIDERS,
  ],
})
export class BlockModule {}

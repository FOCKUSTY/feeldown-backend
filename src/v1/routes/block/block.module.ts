import { Module } from "@nestjs/common";

import { BlockController } from "./block.controller";
import { BlockService } from "./block.service";

import { PrismaService } from "@/database";
import { AUTH_GUARD_PROVIDERS, ONLY_ME_GUARD_PROVIDERS } from "@1/guards";
import {
  RelationshipsValidatorService,
  SERVER_USER_PROVIDERS,
} from "@1/services";

import { FriendshipsService } from "../friendships";
import { FollowService } from "../follow";

@Module({
  controllers: [BlockController],
  providers: [
    BlockService,
    PrismaService,
    RelationshipsValidatorService,
    FollowService,
    FriendshipsService,
    ...AUTH_GUARD_PROVIDERS,
    ...ONLY_ME_GUARD_PROVIDERS,
    ...SERVER_USER_PROVIDERS,
  ],
})
export class BlockModule {}

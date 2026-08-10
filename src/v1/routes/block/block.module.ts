import { Module } from "@nestjs/common";

import { BlockController } from "./block.controller";
import { BlockValidator } from "./block.validator";
import { BlockListener } from "./block.listener";
import { BlockService } from "./block.service";

import { PrismaService } from "@/database";
import { AUTH_GUARD_PROVIDERS, ONLY_ME_GUARD_PROVIDERS } from "@1/guards";
import {
  RelationshipsValidatorService,
  SERVER_USER_PROVIDERS,
} from "@1/services";

import { FriendshipNotificationsEmitter } from "../notifications";
import { FollowService, FollowValidator } from "../follow";
import { FriendshipsService } from "../friendships";

@Module({
  controllers: [BlockController],
  providers: [
    FriendshipNotificationsEmitter,
    RelationshipsValidatorService,
    FollowValidator,
    FollowService,
    BlockListener,
    BlockValidator,
    BlockService,
    PrismaService,
    FriendshipsService,
    ...AUTH_GUARD_PROVIDERS,
    ...ONLY_ME_GUARD_PROVIDERS,
    ...SERVER_USER_PROVIDERS,
  ],
})
export class BlockModule {}

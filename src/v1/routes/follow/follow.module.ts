import { Module } from "@nestjs/common";

import { FollowController } from "./follow.controller";
import { FollowValidator } from "./follow.validator";
import { FollowService } from "./follow.service";
import { FollowListener } from "./follow.listener";

import { PrismaService } from "@/database";
import { AUTH_GUARD_PROVIDERS, ONLY_ME_GUARD_PROVIDERS } from "@1/guards";
import {
  RelationshipsValidatorService,
  SERVER_USER_PROVIDERS,
} from "@1/services";

import { FollowNotificationsEmitter } from "../notifications";

@Module({
  controllers: [FollowController],
  providers: [
    RelationshipsValidatorService,
    FollowValidator,
    FollowService,
    PrismaService,
    FollowNotificationsEmitter,
    FollowListener,
    ...AUTH_GUARD_PROVIDERS,
    ...ONLY_ME_GUARD_PROVIDERS,
    ...SERVER_USER_PROVIDERS,
  ],
})
export class FollowModule {}

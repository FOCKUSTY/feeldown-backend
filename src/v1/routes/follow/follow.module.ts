import { Module } from "@nestjs/common";

import { FollowController } from "./follow.controller";
import { FollowService } from "./follow.service";

import { PrismaService } from "@/database";
import { AUTH_GUARD_PROVIDERS, ONLY_ME_GUARD_PROVIDERS } from "@1/guards";
import {
  RelationshipsValidatorService,
  SERVER_USER_PROVIDERS,
} from "@1/services";

@Module({
  controllers: [FollowController],
  providers: [
    FollowService,
    PrismaService,
    RelationshipsValidatorService,
    ...AUTH_GUARD_PROVIDERS,
    ...ONLY_ME_GUARD_PROVIDERS,
    ...SERVER_USER_PROVIDERS,
  ],
})
export class FollowModule {}

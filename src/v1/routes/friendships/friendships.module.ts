import { Module } from "@nestjs/common";

import { FriendshipsController } from "./friendships.controller";
import { FriendshipsService } from "./friendships.service";
import { FriendshipsListener } from "./friendships.listener";

import { AUTH_GUARD_PROVIDERS } from "@1/guards";
import { SERVER_USER_PROVIDERS } from "@1/services";
import { PrismaService } from "@/database";
import { UsernameSlugPipe } from "@1/pipes";

import { FriendshipNotificationsEmitter } from "../notifications";

@Module({
  imports: [],
  controllers: [FriendshipsController],
  providers: [
    FriendshipsService,
    PrismaService,
    FriendshipNotificationsEmitter,
    UsernameSlugPipe,
    FriendshipsListener,
    ...AUTH_GUARD_PROVIDERS,
    ...SERVER_USER_PROVIDERS,
  ],
})
export class FriendshipsModule {}

export default FriendshipsModule;

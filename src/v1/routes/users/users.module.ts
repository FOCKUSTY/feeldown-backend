import { Module } from "@nestjs/common";

import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

import { PrismaService } from "@/database";
import { AUTH_GUARD_PROVIDERS, ONLY_ME_GUARD_PROVIDERS } from "@1/guards";
import { SERVER_USER_PROVIDERS } from "@1/services";
import { PostsService, PostsValidator } from "../posts";

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    PrismaService,
    UsersService,
    PostsValidator,
    PostsService,
    ...AUTH_GUARD_PROVIDERS,
    ...ONLY_ME_GUARD_PROVIDERS,
    ...SERVER_USER_PROVIDERS,
  ],
})
export class UsersModule {}

export default UsersModule;

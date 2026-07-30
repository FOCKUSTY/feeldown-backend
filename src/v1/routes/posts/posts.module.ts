import { Module } from "@nestjs/common";

import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";

import { PrismaService } from "@/database";
import { AUTH_GUARD_PROVIDERS } from "@1/guards";
import { SERVER_USER_PROVIDERS } from "@1/services";

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [
    PostsService,
    PrismaService,
    ...AUTH_GUARD_PROVIDERS,
    ...SERVER_USER_PROVIDERS,
  ],
})
export class PostsModule {}

export default PostsModule;

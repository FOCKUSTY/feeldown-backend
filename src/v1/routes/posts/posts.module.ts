import { Module } from "@nestjs/common";

import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";

import { PrismaService } from "@/database";
import { AUTH_GUARD_PROVIDERS } from "@1/guards";

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [PostsService, PrismaService, ...AUTH_GUARD_PROVIDERS],
})
export class PostsModule {}

export default PostsModule;

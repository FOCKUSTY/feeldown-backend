import { Module } from "@nestjs/common";

import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { PrismaService } from "@/database";
import { AUTH_GUARD_PROVIDERS } from "@1/guards";

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [PrismaService, UsersService, ...AUTH_GUARD_PROVIDERS],
})
export class UsersModule {}

export default UsersModule;

import { Module } from "@nestjs/common";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { AuthStrategy, PassportStrategy } from "@1/strategies";

import { PrismaService } from "@/database";
import { LoggerService } from "@/services";
import { HashService, ServerUserService } from "@1/services";

@Module({
  controllers: [AuthController],
  providers: [
    PassportStrategy,
    HashService,
    LoggerService,
    AuthStrategy,
    PrismaService,
    AuthService,
    ServerUserService,
  ],
})
export class AuthModule {}

export default AuthModule;

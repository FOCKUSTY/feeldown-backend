import { Module } from "@nestjs/common";

import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";

import { AUTH_GUARD_PROVIDERS } from "@1/guards";
import { PrismaService } from "@/database";

@Module({
  imports: [],
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService, ...AUTH_GUARD_PROVIDERS],
})
export class NotificationsModule {}

export default NotificationsModule;

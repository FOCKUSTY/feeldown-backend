import { Module } from "@nestjs/common";

import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";

import { AUTH_GUARD_PROVIDERS, ONLY_ME_GUARD_PROVIDERS } from "@1/guards";
import { SERVER_USER_PROVIDERS } from "@1/services";
import { PrismaService } from "@/database";

@Module({
  imports: [],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    PrismaService,
    ...AUTH_GUARD_PROVIDERS,
    ...ONLY_ME_GUARD_PROVIDERS,
    ...SERVER_USER_PROVIDERS,
  ],
})
export class NotificationsModule {}

export default NotificationsModule;

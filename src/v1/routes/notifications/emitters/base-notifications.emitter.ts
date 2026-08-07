import type { Notification, NotificationCreateType } from "@1/types";
import { Injectable } from "@nestjs/common";

import { NOTIFICATIONS_ERRORS } from "@1/errors";
import { PrismaService } from "@/database";

@Injectable()
export abstract class BaseNotificationsEmitter {
  public constructor(protected readonly prisma: PrismaService) {}

  protected create(data: NotificationCreateType): Promise<Notification> {
    if (data.actorId === data.recipientId) {
      throw NOTIFICATIONS_ERRORS.CANNOT_NOTIFY_SELF.exception;
    }

    return this.prisma.notification.create({ data });
  }

  protected delete(id: string): Promise<Notification> {
    return this.prisma.notification.delete({ where: { id } });
  }
}

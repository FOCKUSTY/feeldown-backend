import type { BatchPayload } from "@/database/generated/internal/prismaNamespace";
import type { Notification } from "@1/entities";
import type { NotificationWhere } from "@1/types";

import { Injectable } from "@nestjs/common";

import { CrudService } from "@1/services";
import { PrismaService } from "@/database";

@Injectable()
export class NotificationsService extends CrudService<"Notification"> {
  public constructor(protected readonly prisma: PrismaService) {
    super(prisma.notification, CrudService.DEFAULT_DEPENDENCIES);
  }

  public async unreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.prisma.notification.count({
      where: { recipientId: userId },
    });
    return { count };
  }

  public async read(id: string, userId: string): Promise<Notification> {
    return this.updateReaded(id, userId, true);
  }

  public async unread(id: string, userId: string): Promise<Notification> {
    return this.updateReaded(id, userId, false);
  }

  private updateReaded(
    id: string,
    userId: string,
    readed: boolean,
  ): Promise<Notification> {
    return this.prisma.notification.update({
      where: {
        id,
        recipientId: userId,
      },
      data: { readed },
    });
  }

  public async readAll(userId: string): Promise<BatchPayload> {
    return this.updateReadedMany({ recipientId: userId }, true);
  }

  public async unreadAll(userId: string): Promise<BatchPayload> {
    return this.updateReadedMany({ recipientId: userId }, false);
  }

  public async readMany(where: NotificationWhere): Promise<BatchPayload> {
    return this.updateReadedMany(where, true);
  }

  public async unreadMany(where: NotificationWhere): Promise<BatchPayload> {
    return this.updateReadedMany(where, false);
  }

  private updateReadedMany(
    where: NotificationWhere,
    readed: boolean,
  ): Promise<BatchPayload> {
    return this.prisma.notification.updateMany({
      where: {
        ...where,
        readed: !readed,
      },
      data: { readed },
    });
  }
}

export default NotificationsService;

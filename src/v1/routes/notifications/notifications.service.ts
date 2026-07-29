import type { BatchPayload } from "@/database/generated/internal/prismaNamespace";
import type { NotificationFilter, NotificationWhere } from "@1/types";
import type { Notification, User } from "@1/entities";

import { PrismaService } from "@/database";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationsService {
  public constructor(private readonly prisma: PrismaService) {}

  public async get(
    filter: NotificationFilter,
    user: User,
  ): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        recipientId: user.id,
        actorId: filter.actorId,
        readed: filter.readed,
        referenceId: filter.referenceId,
        referenceType: filter.referenceType,
        type: filter.type,
      },
      orderBy: {
        [filter.sortBy]: filter.sort,
      },
      skip: filter.offset,
      take: filter.limit,
    });

    return notifications;
  }

  public async getOne(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    return notification;
  }

  public async unreadCount(user: User): Promise<number> {
    const count = await this.prisma.notification.count({
      where: { recipientId: user.id },
    });
    return count;
  }

  public async read(id: string, user: User): Promise<Notification> {
    return this.updateReaded(id, user, true);
  }

  public async unread(id: string, user: User): Promise<Notification> {
    return this.updateReaded(id, user, false);
  }

  private updateReaded(
    id: string,
    user: User,
    readed: boolean,
  ): Promise<Notification> {
    return this.prisma.notification.update({
      where: {
        id,
        recipientId: user.id,
      },
      data: { readed },
    });
  }

  public async readAll(user: User): Promise<BatchPayload> {
    return this.updateReadedMany({}, user, true);
  }

  public async unreadAll(user: User): Promise<BatchPayload> {
    return this.updateReadedMany({}, user, false);
  }

  public async readMany(
    where: NotificationWhere,
    user: User,
  ): Promise<BatchPayload> {
    return this.updateReadedMany(where, user, true);
  }

  public async unreadMany(
    where: NotificationWhere,
    user: User,
  ): Promise<BatchPayload> {
    return this.updateReadedMany(where, user, false);
  }

  private updateReadedMany(
    where: NotificationWhere,
    user: User,
    readed: boolean,
  ): Promise<BatchPayload> {
    return this.prisma.notification.updateMany({
      where: {
        ...where,
        recipientId: user.id,
        readed: !readed,
      },
      data: { readed },
    });
  }
}

export default NotificationsService;

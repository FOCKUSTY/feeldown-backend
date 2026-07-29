import type { Notification, NotificationCreateType } from "@1/types";

import { PrismaService } from "@/database";
import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationEmitter {
  public constructor(private readonly prisma: PrismaService) {}

  public create(data: NotificationCreateType): Promise<Notification> {
    return this.prisma.notification.create({ data });
  }

  public delete(id: string) {
    return this.prisma.notification.delete({ where: { id } });
  }
}

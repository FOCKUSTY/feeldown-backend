import type { Notification } from "@1/types";
import { ApiProperty, ApiSchema } from "@nestjs/swagger";

import { NotificationType } from "@1/types";

@ApiSchema({ name: "NotificationSchema" })
export class NotificationEntity implements Notification {
  @ApiProperty({
    example: "b85227f2-6852-4242-a169-a0d9c0c88e31",
    description: "Уникальный идентификатор уведомления",
  })
  id: string;

  @ApiProperty({
    example: "6fbafe80-81a0-4ea8-9571-a8efa56fc66e",
    description: "ID пользователя, который получает уведомление",
  })
  recipientId: string;

  @ApiProperty({
    example: "6fbafe80-81a0-4ea8-9571-a8efa56fc66e",
    nullable: true,
    description:
      "ID пользователя, который инициировал событие (может отсутствовать)",
  })
  actorId: string | null;

  @ApiProperty({
    enum: NotificationType,
    example: NotificationType.REACT_POST,
    examples: Object.keys(NotificationType),
    description: "Тип уведомления",
  })
  type: NotificationType;

  @ApiProperty({
    example: "Post",
    description:
      "Тип сущности, к которой относится уведомление (например, Post, Comment)",
  })
  referenceType: string;

  @ApiProperty({
    example: "b85227f2-6852-4242-a169-a0d9c0c88e31",
    description: "ID сущности, к которой относится уведомление",
  })
  referenceId: string;

  @ApiProperty({
    example: false,
    description: "Статус прочтения уведомления",
  })
  readed: boolean;

  @ApiProperty({
    example: "2025-01-01T00:00:00.000Z",
    description: "Дата и время создания уведомления",
  })
  createdAt: Date;
}

export type { Notification };

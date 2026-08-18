import type { NotificationWhere } from "@1/types";
import { NotificationType, ReferenceType } from "@1/types";

import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { IsOptional, IsString, IsBoolean, IsEnum } from "class-validator";
import { Type } from "class-transformer";

@ApiSchema({
  name: "NotificationWhereSchema",
})
export class NotificationWhereDto implements Omit<
  NotificationWhere,
  "recipientId"
> {
  @ApiPropertyOptional({
    description: "ID пользователя-инициатора",
    example: "6fbafe80-81a0-4ea8-9571-a8efa56fc66e",
  })
  @IsOptional()
  @IsString()
  actorId?: string;

  @ApiPropertyOptional({
    enum: ReferenceType,
    description: "Тип сущности (например, POST, COMMENT)",
    example: ReferenceType.POST,
  })
  @IsOptional()
  @IsEnum(ReferenceType)
  referenceType?: ReferenceType;

  @ApiPropertyOptional({
    description: "ID сущности, к которой относится уведомление",
    example: "b85227f2-6852-4242-a169-a0d9c0c88e31",
  })
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiPropertyOptional({
    description: "Статус прочтения",
    example: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readed?: boolean;

  @ApiPropertyOptional({
    enum: NotificationType,
    description: "Тип уведомления",
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;
}

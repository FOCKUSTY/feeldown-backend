import type { NotificationWhere } from "@1/types";
import { NotificationType } from "@1/types";

import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, IsBoolean, IsEnum } from "class-validator";

export class NotificationWhereDto implements NotificationWhere {
  @ApiPropertyOptional({
    description: "ID пользователя-инициатора",
    example: "6fbafe80-81a0-4ea8-9571-a8efa56fc66e",
  })
  @IsOptional()
  @IsString()
  actorId?: string;

  @ApiPropertyOptional({
    description: "Тип сущности (например, Post, Comment)",
    example: "Post",
  })
  @IsOptional()
  @IsString()
  referenceType?: string;

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

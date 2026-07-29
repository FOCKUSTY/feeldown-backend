import type { NotificationFilter } from "@1/types";
import {
  AVAILABLE_NOTIFICATION_SORT_TYPES,
  AVAILABLE_SORT_ORDERING,
} from "@1/constants";

import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, Min } from "class-validator";

import { NotificationWhereDto } from "./notification-where.dto";

export class NotificationFilterDto
  extends NotificationWhereDto
  implements NotificationFilter
{
  @ApiPropertyOptional({
    enum: AVAILABLE_SORT_ORDERING,
    default: "desc",
    description: "Порядок сортировки",
  })
  @IsOptional()
  @IsIn(AVAILABLE_SORT_ORDERING)
  sort: "asc" | "desc" = "desc";

  @ApiPropertyOptional({
    default: 20,
    minimum: 1,
    description: "Количество записей на страницу",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 20;

  @ApiPropertyOptional({
    default: 0,
    minimum: 0,
    description: "Смещение (пропустить N записей)",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number = 0;

  @ApiPropertyOptional({
    enum: AVAILABLE_NOTIFICATION_SORT_TYPES,
    default: "createdAt",
    description: "Поле для сортировки",
  })
  @IsOptional()
  @IsIn(AVAILABLE_NOTIFICATION_SORT_TYPES)
  sortBy: (typeof AVAILABLE_NOTIFICATION_SORT_TYPES)[number] = "createdAt";
}

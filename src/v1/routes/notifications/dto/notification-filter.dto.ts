import type { NotificationFilter } from "@1/types";
import { AVAILABLE_NOTIFICATION_SORT_TYPES } from "@1/constants";

import {
  ApiPropertyOptional,
  ApiSchema,
  IntersectionType,
} from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";

import { NotificationWhereDto } from "./notification-where.dto";
import { BaseFilterDto } from "@1/dto";

@ApiSchema({
  name: "NotificationFilterSchema",
})
export class NotificationFilterDto
  extends IntersectionType(BaseFilterDto, NotificationWhereDto)
  implements NotificationFilter
{
  @ApiPropertyOptional({
    enum: AVAILABLE_NOTIFICATION_SORT_TYPES,
    default: "createdAt",
    description: "Поле для сортировки",
  })
  @IsOptional()
  @IsIn(AVAILABLE_NOTIFICATION_SORT_TYPES)
  sortBy: (typeof AVAILABLE_NOTIFICATION_SORT_TYPES)[number] = "createdAt";
}

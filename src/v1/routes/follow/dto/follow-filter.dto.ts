import type { FollowFilter } from "@1/types";
import { BaseFilterDto } from "@1/dto";
import { AVAILABLE_FOLLOW_SORT_TYPES } from "@1/constants";

import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";

@ApiSchema({ name: "FollowFilterSchema" })
export class FollowFilterDto extends BaseFilterDto implements FollowFilter {
  @ApiPropertyOptional({
    enum: AVAILABLE_FOLLOW_SORT_TYPES,
    default: "createdAt",
    description: "Поле для сортировки",
  })
  @IsOptional()
  @IsIn(AVAILABLE_FOLLOW_SORT_TYPES)
  sortBy: (typeof AVAILABLE_FOLLOW_SORT_TYPES)[number] = "createdAt";
}

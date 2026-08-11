import type { PostFilter } from "@1/types";

import { AVAILABLE_POST_SORT_TYPES } from "@1/constants";
import { BaseFilterDto } from "@1/dto";

import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";

export class PostsFilterDto extends BaseFilterDto implements PostFilter {
  @ApiPropertyOptional({
    enum: AVAILABLE_POST_SORT_TYPES,
    default: "createdAt",
    description: "Поле для сортировки",
  })
  @IsOptional()
  @IsIn(AVAILABLE_POST_SORT_TYPES)
  sortBy: (typeof AVAILABLE_POST_SORT_TYPES)[number] = "createdAt";
}

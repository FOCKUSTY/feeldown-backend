import type { BaseFilter } from "@1/types";

import { AVAILABLE_SORT_ORDERING } from "@1/constants";
import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";

import { Type } from "class-transformer";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsUUID as IsUuid,
  Max,
  Min,
} from "class-validator";

@ApiSchema({
  name: "BaseFilterSchema",
})
export class BaseFilterDto implements BaseFilter {
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
    maximum: 100,
    description: "Количество записей на страницу",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @IsOptional()
  @IsUuid(7)
  cursor?: string;
}

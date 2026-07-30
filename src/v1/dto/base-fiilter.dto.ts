import type { BaseFilter } from "@1/types";

import { AVAILABLE_SORT_ORDERING } from "@1/constants";
import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";

import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, Min } from "class-validator";

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
    minimum: 5,
    description: "Количество записей на страницу",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
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
}

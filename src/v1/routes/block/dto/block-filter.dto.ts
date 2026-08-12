import type { BlockFilter } from "@1/types";

import { BaseFilterDto } from "@1/dto";
import { AVAILABLE_BLOCK_SORT_TYPES } from "@1/constants";
import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";
import { Schema } from "@1/enums";

@ApiSchema({ name: Schema.BLOCK_FILTER })
export class BlockFilterDto extends BaseFilterDto implements BlockFilter {
  @ApiPropertyOptional({
    enum: AVAILABLE_BLOCK_SORT_TYPES,
    default: "createdAt",
    description: "Поле для сортировки",
  })
  @IsOptional()
  @IsIn(AVAILABLE_BLOCK_SORT_TYPES)
  sortBy: (typeof AVAILABLE_BLOCK_SORT_TYPES)[number] = "createdAt";
}

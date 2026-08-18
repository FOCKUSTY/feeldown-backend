import type { FriendshipFilter } from "@1/types";

import { AVAILABLE_FRIENDSHIP_SORT_TYPES } from "@1/constants";
import { FriendRequestStatus } from "@1/types";
import { BaseFilterDto } from "@1/dto";

import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { IsEnum, IsIn, IsOptional, IsString } from "class-validator";
import { Schema } from "@1/enums";

@ApiSchema({
  name: Schema.FRIENDSHIP_FILTER,
})
export class FriendshipFilterDto
  extends BaseFilterDto
  implements FriendshipFilter
{
  @ApiPropertyOptional({
    enum: AVAILABLE_FRIENDSHIP_SORT_TYPES,
    default: "createdAt",
    description: "Поле для сортировки",
  })
  @IsOptional()
  @IsIn(AVAILABLE_FRIENDSHIP_SORT_TYPES)
  sortBy: (typeof AVAILABLE_FRIENDSHIP_SORT_TYPES)[number] = "createdAt";

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  receiverId?: string | undefined;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  senderId?: string | undefined;

  @ApiPropertyOptional({
    enum: FriendRequestStatus,
    default: FriendRequestStatus.ACCEPTED,
    description: "Статус дружбы",
  })
  @IsOptional()
  @IsEnum(FriendRequestStatus)
  status: FriendRequestStatus = FriendRequestStatus.ACCEPTED;
}

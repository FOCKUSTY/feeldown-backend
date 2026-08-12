import type { FriendRequest } from "@1/types";
import { FriendRequestStatus } from "@1/types";

import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsDate, IsEnum, IsUUID as IsUuid } from "class-validator";
import { Type } from "class-transformer";
import { Schema } from "@1/enums";

@ApiSchema({ name: Schema.FRIEND_REQUEST })
export class FriendRequestEntity implements FriendRequest {
  @ApiProperty()
  @IsUuid(7)
  id: string;

  @ApiProperty()
  @IsUuid(7)
  senderId: string;

  @ApiProperty()
  @IsUuid(7)
  receiverId: string;

  @ApiProperty({ enum: FriendRequestStatus })
  @IsEnum(FriendRequestStatus)
  status: FriendRequestStatus;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}

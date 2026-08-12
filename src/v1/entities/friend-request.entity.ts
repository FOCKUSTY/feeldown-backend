import type { FriendRequest } from "@1/types";
import { FriendRequestStatus } from "@1/types";

import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsDate, IsEnum, IsUUID } from "class-validator";
import { Type } from "class-transformer";
import { Schema } from "@1/enums";

@ApiSchema({ name: Schema.FRIEND_REQUEST })
export class FriendRequestEntity implements FriendRequest {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  senderId: string;

  @ApiProperty()
  @IsUUID()
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

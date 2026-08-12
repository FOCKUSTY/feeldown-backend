import type { Follow } from "@1/types";

import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsDate, IsUUID as IsUuid } from "class-validator";
import { Type } from "class-transformer";
import { Schema } from "@1/enums";

@ApiSchema({ name: Schema.FOLLOW })
export class FollowEntity implements Follow {
  @ApiProperty()
  @IsUuid(7)
  id: string;

  @ApiProperty()
  @IsUuid(7)
  followerId: string;

  @ApiProperty()
  @IsUuid(7)
  followeeId: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}

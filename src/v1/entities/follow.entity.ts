import type { Follow } from "@1/types";

import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsDate, IsUUID } from "class-validator";
import { Type } from "class-transformer";
import { Schema } from "@1/enums";

@ApiSchema({ name: Schema.FOLLOW })
export class FollowEntity implements Follow {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  followerId: string;

  @ApiProperty()
  @IsUUID()
  followeeId: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;
}

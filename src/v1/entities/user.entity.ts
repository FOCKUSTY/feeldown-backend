import type { User } from "@1/types";

import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsDate, IsString, IsUUID, Length } from "class-validator";
import { Type } from "class-transformer";
import { Schema } from "@1/enums";

@ApiSchema({ name: Schema.USER })
export class UserEntity implements User {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @Length(0, 1024)
  description: string;

  @ApiProperty()
  @IsString()
  @Length(3, 32)
  username: string;

  @ApiProperty()
  @IsString()
  @Length(1, 128)
  nickname: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  createdAt: Date;
}

export type { User };

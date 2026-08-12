import type { Post } from "@1/types";

import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsUUID, IsString, Length, IsDate } from "class-validator";
import { Type } from "class-transformer";
import { Schema } from "@1/enums";

@ApiSchema({ name: Schema.POST })
export class PostEntity implements Post {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  @Length(1, 256)
  title: string;

  @ApiProperty()
  @IsString()
  @Length(1, 256)
  postname: string;

  @ApiProperty()
  @IsString()
  @Length(1, 8192)
  content: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}

export type { Post };

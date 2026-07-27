import type { Post } from "@1/entities";

import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class PostCreateDto implements Partial<Post> {
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
}

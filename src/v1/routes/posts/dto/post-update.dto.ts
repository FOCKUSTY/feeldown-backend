import type { Post } from "@1/entities";

import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class PostUpdateDto implements Partial<Post> {
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
  @Length(1, 2048)
  content: string;
}

import type { Post } from "@1/entities";

import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";

export class PostUpdateDto implements Partial<Post> {
  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Length(1, 256)
  title?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Length(1, 256)
  postname?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Length(1, 2048)
  content?: string;
}

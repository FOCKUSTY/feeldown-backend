import type { Post } from "@1/entities";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";
import { IsName, Trim } from "@/decorators";

export class PostCreateDto implements Partial<Post> {
  @ApiProperty()
  @IsString()
  @Length(1, 256)
  @Trim()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 256)
  @IsName()
  @Trim()
  postname?: string;

  @ApiProperty()
  @IsString()
  @Length(1, 8192)
  @Trim()
  content: string;
}

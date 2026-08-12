import type { Post } from "@1/entities";

import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";
import { IsName } from "@/decorators";
import { Schema } from "@1/enums";

@ApiSchema({ name: Schema.POST_UPDATE })
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
  @IsName()
  postname?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsString()
  @Length(1, 2048)
  content?: string;
}

import type { User } from "@1/entities";

import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";
import { IsName, Trim } from "@/decorators";

export class UserUpdateDto implements Partial<User> {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Trim()
  nickname?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(3, 30)
  @Trim()
  @IsName()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 2048)
  @Trim()
  description?: string;
}

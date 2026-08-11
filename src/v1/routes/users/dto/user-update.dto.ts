import type { User } from "@1/entities";

import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";
import { Trim } from "@/utils";

export class UserUpdateDto implements Partial<User> {
  @IsOptional()
  @ApiProperty()
  @IsString()
  @Length(1, 100)
  @Trim()
  nickname?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  @Length(3, 30)
  @Trim()
  username?: string;

  @IsOptional()
  @ApiProperty()
  @IsString()
  @Length(0, 2048)
  @Trim()
  description?: string;
}

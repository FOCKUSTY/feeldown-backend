import type { User } from "@1/entities";

import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";
import { Trim } from "@/utils";

export class UserUpdateDto implements Partial<User> {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Trim()
  nickname: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(3, 30)
  @Trim()
  username: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(0, 2048)
  @Trim()
  description?: string;
}

import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

import { Transform } from "class-transformer";
import { Schema } from "@1/enums";

@ApiSchema({
  name: Schema.USER_CREATE,
})
export class UserCreateDto {
  @ApiProperty()
  @IsString()
  @MaxLength(64)
  @MinLength(2)
  @Transform(({ value }) => value.toLowerCase())
  username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(64)
  @MinLength(2)
  nickname?: string;
}

@ApiSchema({
  name: Schema.USER_CREDENTIALS,
})
export class UserCreateCredentialsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsString()
  password: string;
}

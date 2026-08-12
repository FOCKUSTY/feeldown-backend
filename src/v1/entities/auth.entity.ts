import type { AuthTypes, Auth } from "@1/types";
import type { Profile } from "passport";

import { ApiProperty, ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";

import {
  IsDate,
  IsOptional,
  IsString,
  IsUUID as IsUuid,
} from "class-validator";
import { Type } from "class-transformer";
import { Schema } from "@1/enums";

export interface PasswordCredentials {
  username: string;
  password: string;
}

export interface SignUpByPasswordData extends PasswordCredentials {
  nickname?: string;
  email?: string;
}

export interface PassportCredentials {
  accessToken: string;
  refreshToken?: string;
}

export interface ServiceCredentials extends PassportCredentials {
  profile: Profile;
  accessToken: string;
  refreshToken?: string;
  name: AuthTypes;
}

export interface ServiceMeta {
  id: string;
  name: AuthTypes;
}

export interface SignUpData {
  username: string;
  nickname?: string;
  email?: string;
  password?: string;
  service?: ServiceMeta & PassportCredentials;
}

@ApiSchema({ name: Schema.AUTH })
export class AuthEntity implements Auth {
  @ApiProperty()
  @IsUuid(7)
  id: string;

  @ApiProperty()
  @IsUuid(7)
  userId: string;

  @ApiProperty()
  @IsString()
  token: string;

  @ApiPropertyOptional({ type: "string", nullable: true })
  @IsOptional()
  @IsString()
  email: string | null;

  @ApiPropertyOptional({ type: "string", nullable: true })
  @IsOptional()
  @IsString()
  password: string | null;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}

export type { Auth };

import type { ServerUser } from "@1/types";

import { ApiProperty, ApiSchema } from "@nestjs/swagger";

import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { AuthEntity } from "./auth.entity";
import { UserEntity } from "./user.entity";

@ApiSchema({ name: "ServerUserSchema" })
export class ServerUserEntity implements ServerUser {
  @ApiProperty({ type: AuthEntity })
  @ValidateNested()
  @Type(() => AuthEntity)
  auth: AuthEntity;

  @ApiProperty({ type: UserEntity })
  @ValidateNested()
  @Type(() => UserEntity)
  user: UserEntity;
}

export type { ServerUser };

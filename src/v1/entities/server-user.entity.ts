import type { ServerUser } from "@1/types";

import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { AuthEntity } from "./auth.entity";
import { UserEntity } from "./user.entity";

@ApiSchema({ name: "ServerUserSchema" })
export class ServerUserEntity implements ServerUser {
  @ApiProperty({
    type: AuthEntity,
    description: "Данные аутентификации пользователя",
  })
  auth: AuthEntity;

  @ApiProperty({ type: UserEntity, description: "Данные профиля пользователя" })
  user: UserEntity;
}

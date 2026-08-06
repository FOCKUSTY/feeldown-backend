import { HttpStatus } from "@nestjs/common";
import { fockerorFactory } from "@/errors";

export const RELATIONSHIPS_ERRORS = fockerorFactory.execute(
  "RELATION EXCEPTION",
  {
    BLOCKED_BY_USER: {
      message: "You are blocked by this user",
      description: "Пользователь заблокировал текущего пользователя",
      status: HttpStatus.FORBIDDEN,
    },
    USER_BLOCKED: {
      message: "You have blocked this user",
      description: "Текущий пользователь заблокировал этого пользователя",
      status: HttpStatus.FORBIDDEN,
    },
  },
);

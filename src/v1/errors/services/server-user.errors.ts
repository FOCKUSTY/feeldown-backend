import { HttpStatus } from "@nestjs/common";
import { fockerorFactory } from "@/errors";

export const SERVER_USER_ERRORS = fockerorFactory.execute("AUTH EXCEPTION", {
  AUTH_NOT_FOUND: {
    message: "User not found",
    description:
      "(auth) Пользователь не был найден по данным из запроса, возможно токен устарел",
    status: HttpStatus.FORBIDDEN,
  },

  USER_ID: {
    message: "Profile id is not equals",
    description:
      "Пользователь по данным токена был найден, но id пользователя в БД не соответствует id пользователя в токене",
    status: HttpStatus.FORBIDDEN,
  },

  USER_NOT_FOUND: {
    message: "Profile not found",
    description:
      "Пользователь не был найден по данным из запроса, возможно токен устарел",
    status: HttpStatus.FORBIDDEN,
  },

  TOKEN_ERROR: {
    message: "Token is not equals",
    description: "Токен невалиден с токеном из БД, возможно но устарел",
    status: HttpStatus.FORBIDDEN,
  },
});

export default SERVER_USER_ERRORS;

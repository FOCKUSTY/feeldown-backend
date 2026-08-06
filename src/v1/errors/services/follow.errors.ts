import { HttpStatus } from "@nestjs/common";
import { fockerorFactory } from "@/errors";

export const FOLLOW_ERRORS = fockerorFactory.execute("FOLLOW EXCEPTION", {
  CANNOT_FOLLOW_SELF: {
    message: "You cannot follow yourself",
    description: "Попытка подписаться на самого себя",
    status: HttpStatus.BAD_REQUEST,
  },
  ALREADY_FOLLOWING: {
    message: "Follow already exists",
    description: "Подписка уже существует",
    status: HttpStatus.CONFLICT,
  },
  FOLLOW_NOT_FOUND: {
    message: "Follow not found",
    description: "Подписка не найдена",
    status: HttpStatus.NOT_FOUND,
  },
  NOT_FOLLOWER: {
    message: "You are not the follower",
    description: "Пользователь не является подписчиком",
    status: HttpStatus.FORBIDDEN,
  },
});

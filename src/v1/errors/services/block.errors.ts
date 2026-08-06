import { HttpStatus } from "@nestjs/common";
import { fockerorFactory } from "@/errors";

export const BLOCK_ERRORS = fockerorFactory.execute("BLOCK EXCEPTION", {
  CANNOT_BLOCK_SELF: {
    message: "You cannot block yourself",
    description: "Попытка заблокировать самого себя",
    status: HttpStatus.BAD_REQUEST,
  },
  ALREADY_BLOCKED: {
    message: "Block already exists",
    description: "Блокировка уже существует",
    status: HttpStatus.CONFLICT,
  },
  BLOCK_NOT_FOUND: {
    message: "Block not found",
    description: "Блокировка не найдена",
    status: HttpStatus.NOT_FOUND,
  },
  NOT_BLOCKER: {
    message: "You are not the blocker",
    description: "Пользователь не является блокирующим",
    status: HttpStatus.FORBIDDEN,
  },
});

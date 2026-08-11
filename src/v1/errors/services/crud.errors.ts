import { HttpStatus } from "@nestjs/common";
import { fockerorFactory } from "@/errors";

export const CRUD_ERRORS = fockerorFactory.execute("CRUD EXCEPTION", {
  NOT_VALID: {
    message: "Валидация не пройдена",
    description: "Валидатор вернул false вместо выброса ошибки",
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  NOT_FOUND: {
    message: "Resource not found",
    description: "Запрашиваемый ресурс не был найден",
    status: HttpStatus.NOT_FOUND,
  },
});

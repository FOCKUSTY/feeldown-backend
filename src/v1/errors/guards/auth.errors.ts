import { HttpStatus } from "@nestjs/common";
import { fockerorFactory } from "@/errors";

export const AUTH_ERRORS = fockerorFactory.execute("AUTH EXCEPTION", {
  HASH_PARSE: {
    message: "Parse exception",
    description:
      "Ошибка, связанная с парсингом запроса токенов, возможно запрос содержит неправильные данные",
    status: HttpStatus.FORBIDDEN,
  },

  PARAMETER_IS_NOT_DEFINED: {
    message: "Parameter ${{ parameter }} is not defined",
    description: "Параметр ${{ parameter }} не был объявлен",
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
});

export default AUTH_ERRORS;

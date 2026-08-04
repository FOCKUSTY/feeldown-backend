import { fockerorFactory } from "@/errors";
import { HttpStatus } from "@nestjs/common";

export const SLUG_PIPE_ERRORS = fockerorFactory.execute("SLUG PIPE EXCEPTION", {
  UNAUTHORIZED: {
    message: "Unauthorized",
    description: "Не авторизован",
    status: HttpStatus.UNAUTHORIZED,
  },
});

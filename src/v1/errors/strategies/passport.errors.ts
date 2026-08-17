import { fockerorFactory } from "@/errors";
import { AuthTypes } from "@1/types";
import { HttpStatus } from "@nestjs/common";

export const PASSPORT_STRATEGY_ERRORS = fockerorFactory.execute(
  "PASSPORT STRATEGY EXCEPTION",
  {
    METHOD_NOT_FOUND: {
      message: "Method ${{ method }} not found",
      description: `Метод \${{ method }} не был найден, попробуйте что-нибудь из следующего: ${Object.keys(AuthTypes)}`,
      status: HttpStatus.FOUND,
    },
  },
);

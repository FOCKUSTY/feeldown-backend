import type { ExceptionHandlerResult } from "@1/types";

import { HttpStatus } from "@nestjs/common";
import { AbstractExceptionHandler } from "./abstract-exception-handler";

export class DefaultExceptionHandler extends AbstractExceptionHandler {
  public isValid(): boolean {
    return true;
  }

  public execute(exception: Error): ExceptionHandlerResult {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message || "Internal server error",
    };
  }
}

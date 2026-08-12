import type { ExceptionHandlerResult } from "@1/types";

import { HttpException } from "@nestjs/common";
import { AbstractExceptionHandler } from "./abstract-exception-handler";

export class HttpExceptionHandler extends AbstractExceptionHandler {
  public isValid(exception: unknown): boolean {
    return exception instanceof HttpException;
  }

  public execute(exception: HttpException): ExceptionHandlerResult {
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === "string"
        ? exceptionResponse
        : (
            exceptionResponse as Record<string, unknown>
          )?.message?.toString?.() || exception.message;

    return { statusCode, message };
  }
}

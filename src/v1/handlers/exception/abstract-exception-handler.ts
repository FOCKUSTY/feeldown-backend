import type { ArgumentsHost } from "@nestjs/common";
import type { ExceptionHandlerType, ExceptionHandlerResult } from "@1/types";

export abstract class AbstractExceptionHandler implements ExceptionHandlerType {
  public abstract isValid(exception: unknown): boolean;
  public abstract execute(
    exception: unknown,
    host: ArgumentsHost,
  ): ExceptionHandlerResult;
}

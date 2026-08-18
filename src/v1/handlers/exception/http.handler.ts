import { HttpException } from "@nestjs/common";
import { AbstractExceptionHandler } from "./abstract-exception-handler";

export class HttpExceptionHandler extends AbstractExceptionHandler {
  public isValid(exception: unknown): boolean {
    return exception instanceof HttpException;
  }

  public execute(exception: HttpException): never {
    throw exception;
  }
}

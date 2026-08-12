import type { ArgumentsHost } from "@nestjs/common";
import type { ExceptionHandlerType, ExceptionHandlerResult } from "@1/types";

export class ExceptionHandlerRegistry {
  private readonly handlers: ExceptionHandlerType[] = [];

  public apply(...handlers: ExceptionHandlerType[]): this {
    this.handlers.push(...handlers);
    return this;
  }

  public handle(
    exception: unknown,
    host: ArgumentsHost,
  ): ExceptionHandlerResult | false {
    for (const handler of this.handlers) {
      if (!handler.isValid(exception)) {
        continue;
      }

      return handler.execute(exception, host);
    }

    return false;
  }
}

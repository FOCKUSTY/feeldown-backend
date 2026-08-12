import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";

import { Catch } from "@nestjs/common";
import { ExceptionHandlerRegistry, PrismaExceptionHandler } from "@1/handlers";

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly registry: ExceptionHandlerRegistry;

  public constructor() {
    this.registry = new ExceptionHandlerRegistry().apply(
      new PrismaExceptionHandler(),
    );
  }

  public catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const { statusCode, message } = this.registry.handle(exception, host);

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";

import { Catch } from "@nestjs/common";
import { LoggerService } from "@/services";
import {
  DefaultExceptionHandler,
  ExceptionHandlerRegistry,
  HttpExceptionHandler,
} from "@1/handlers";

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly registry: ExceptionHandlerRegistry;

  public constructor(private readonly logger: LoggerService) {
    this.registry = new ExceptionHandlerRegistry().apply(
      new HttpExceptionHandler(),
      new DefaultExceptionHandler(),
    );
  }

  public catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const { statusCode, message } = this.registry.handle(exception, host);

    this.logger.error([
      new Error(`[Exception] ${statusCode} - ${message}`),
      exception as Error,
    ]);

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

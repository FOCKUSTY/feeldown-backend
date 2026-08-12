import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";

import { Catch, HttpStatus } from "@nestjs/common";
import { LoggerService } from "@/services";
import {
  DefaultExceptionHandler,
  ExceptionHandlerRegistry,
  HttpExceptionHandler,
} from "@1/handlers";

@Catch()
export class DefaultExceptionFilter implements ExceptionFilter {
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

    const handled = this.registry.handle(exception, host);
    if (!handled) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error",
        timestamp: new Date().toISOString(),
        path: request.url
      });
      return;
    }

    const { statusCode, message } = handled;    
    this.logger.error([
      new Error(`[Default Exception] ${statusCode}`),
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

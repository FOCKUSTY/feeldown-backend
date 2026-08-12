import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common";

import { Catch } from "@nestjs/common";
import { LoggerService } from "@/services";
import { ExceptionHandlerRegistry, PrismaExceptionHandler } from "@1/handlers";

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly registry: ExceptionHandlerRegistry;

  public constructor(private readonly logger: LoggerService) {
    this.registry = new ExceptionHandlerRegistry().apply(
      new PrismaExceptionHandler(),
    );
  }

  public catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const handled = this.registry.handle(exception, host);
    if (!handled) {
      throw exception;
    }

    const { statusCode, message } = handled;    
    this.logger.error([
      new Error(`[Prisma Exception] ${statusCode} - ${message}`),
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

import type { ExceptionHandlerResult } from "@1/types";

import { HttpStatus } from "@nestjs/common";
import { Prisma } from "@/database/generated/client";
import { AbstractExceptionHandler } from "./abstract-exception-handler";

export class PrismaExceptionHandler extends AbstractExceptionHandler {
  private readonly errorCodeMap: Record<
    string,
    { status: number; message: string }
  > = {
    P2002: {
      status: HttpStatus.CONFLICT,
      message: "Duplicate value for {target}",
    },
    P2003: {
      status: HttpStatus.BAD_REQUEST,
      message: "Related record not found",
    },
    P2025: { status: HttpStatus.NOT_FOUND, message: "Record not found" },
  };

  public isValid(exception: unknown): boolean {
    return exception instanceof Prisma.PrismaClientKnownRequestError;
  }

  public execute(
    exception: Prisma.PrismaClientKnownRequestError,
  ): ExceptionHandlerResult {
    const { code, meta } = exception;
    const config = this.errorCodeMap[code];

    if (!config) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Database error",
      };
    }

    const message = config.message.replace(
      "{target}",
      (meta?.target as string[])?.join(", ") || "field",
    );

    return {
      statusCode: config.status,
      message,
    };
  }
}

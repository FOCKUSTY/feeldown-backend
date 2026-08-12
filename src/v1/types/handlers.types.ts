import { ExecutionContext } from "@nestjs/common";
import type { ArgumentsHost } from "@nestjs/common";

export type MetadataHandlerType = {
  execute(context: ExecutionContext): Promise<boolean>;
};

export type ExceptionHandlerResult = {
  statusCode: number;
  message: string;
};

export type ExceptionHandlerType = {
  isValid(exception: unknown): boolean;
  execute(exception: unknown, host: ArgumentsHost): ExceptionHandlerResult;
};

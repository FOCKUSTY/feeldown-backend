import { validateInstanceByClassOrThrow } from "@/utils";
import {
  createParamDecorator as createParameterDecorator,
  ExecutionContext,
} from "@nestjs/common";
import { ClassConstructor } from "class-transformer";

export const UseHeadersValidation = createParameterDecorator(
  async (
    classConstructor: ClassConstructor<object>,
    context: ExecutionContext,
  ) => {
    const { headers } = context.switchToHttp().getRequest();
    return validateInstanceByClassOrThrow(headers, classConstructor);
  },
);

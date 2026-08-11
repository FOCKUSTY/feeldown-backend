import { validateInstanceByClassOrThrow } from "@/utils";
import { ClassConstructor } from "class-transformer";
import {
  createParamDecorator as createParameterDecorator,
  ExecutionContext,
} from "@nestjs/common";

export const Headers = createParameterDecorator(
  async (
    classConstructor: ClassConstructor<object>,
    context: ExecutionContext,
  ) => {
    const { headers } = context.switchToHttp().getRequest();
    return validateInstanceByClassOrThrow(headers, classConstructor);
  },
);

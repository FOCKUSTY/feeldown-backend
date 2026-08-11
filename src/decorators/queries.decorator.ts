import {
  createParamDecorator as createParameterDecorator,
  ExecutionContext,
} from "@nestjs/common";
import { ClassConstructor } from "class-transformer";
import { validateInstanceByClassOrThrow } from "@/utils";

export const Queries = createParameterDecorator(
  async (
    classConstructor: ClassConstructor<object>,
    context: ExecutionContext,
  ) => {
    const { query } = context.switchToHttp().getRequest();
    return validateInstanceByClassOrThrow(query, classConstructor);
  },
);

import {
  createParamDecorator as createParameterDecorator,
  ExecutionContext,
} from "@nestjs/common";
import { ClassConstructor } from "class-transformer";
import { validateInstanceByClassOrThrow } from "@/utils";

export const UseQueryValidation = createParameterDecorator(
  async (
    classConstuctor: ClassConstructor<object>,
    context: ExecutionContext,
  ) => {
    const request = context.switchToHttp().getRequest();
    const { query } = request;
    return validateInstanceByClassOrThrow(query, classConstuctor);
  },
);

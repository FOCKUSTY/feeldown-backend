import { HttpException, HttpStatus } from "@nestjs/common";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { tryCatchNullAsync } from "./try-catch.utils";

type BaseInstance = {
  [key: string]: unknown;
};

export const validateInstanceByClassOrThrow = async <T extends BaseInstance>(
  plain: T,
  classConstructor: ClassConstructor<T>,
) => {
  const instance = plainToInstance(classConstructor, plain);
  const errors = await validate(instance);

  if (errors.length > 0) {
    const validationErrors = errors.map((obj) =>
      Object.values(obj.constraints!),
    );
    throw new HttpException(
      `Validation failed with following Errors: ${validationErrors}`,
      HttpStatus.BAD_REQUEST,
    );
  }

  return instance;
};

export const validateInstanceByClass = async <T extends BaseInstance>(
  plain: T,
  classConstructor: ClassConstructor<T>,
): Promise<T | null> => {
  return tryCatchNullAsync(() =>
    validateInstanceByClassOrThrow(plain, classConstructor),
  );
};

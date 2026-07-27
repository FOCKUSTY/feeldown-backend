import { Transform } from "class-transformer";

export const Trim = (): PropertyDecorator => {
  return Transform(({ value }) => value.trim());
};

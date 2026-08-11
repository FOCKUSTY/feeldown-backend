import { Transform } from "class-transformer";

export const Trim = (): PropertyDecorator => {
  return Transform(({ value }) => {
    if (typeof value === "string") {
      return value.trim();
    }

    return value;
  });
};

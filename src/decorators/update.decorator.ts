import { applyDecorators, Patch, Put } from "@nestjs/common";

export const Update = (path: string | string[]) => {
  return applyDecorators(Put(path), Patch(path));
};

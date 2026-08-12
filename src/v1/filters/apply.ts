import { Provider } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

import { PrismaExceptionFilter } from "./prisma.filter";
import { DefaultExceptionFilter } from "./default.filter";

export const APP_FILTERS = [DefaultExceptionFilter, PrismaExceptionFilter];
export const applyAppFilters = (): Provider[] => {
  return APP_FILTERS.map(
    (filter) =>
      <Provider>{
        provide: APP_FILTER,
        useClass: filter,
      },
  );
};

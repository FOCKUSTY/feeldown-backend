import { Provider } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

import { DefaultExceptionFilter } from "./prisma.filter";
import { PrismaExceptionFilter } from "./default.filter";

export const APP_FILTERS = [PrismaExceptionFilter, DefaultExceptionFilter];
export const applyAppFilters = (): Provider[] => {
  return APP_FILTERS.map(
    (filter) =>
      <Provider>{
        provide: APP_FILTER,
        useClass: filter,
      },
  );
};

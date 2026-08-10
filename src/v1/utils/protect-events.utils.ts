import { tryCatch } from "@/utils";
import { HttpException } from "@nestjs/common";

type Events = Record<string, (...parameters: any[]) => any>;

export const protectEvents = <const T extends Events>(events: T) => {
  const entries = Object.entries(events);
  const map = entries.map(([name, event]) => {
    const func = (...parameters: Parameters<typeof event>) => {
      return tryCatch(
        () => {
          return event(parameters);
        },
        (error: unknown): null => {
          if (error instanceof HttpException) {
            throw error;
          }

          return null;
        },
      );
    };

    return [name, func];
  });

  const protectedEvents = Object.fromEntries(map);
  return protectedEvents;
};

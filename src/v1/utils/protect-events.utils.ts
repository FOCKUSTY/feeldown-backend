import { tryCatch, tryCatchAsync } from "@/utils";

type Events = Record<string, (...parameters: any[]) => any>;
type AsyncEvents = Record<string, (...parameters: any[]) => Promise<any>>;

export const protectEvents = <const T extends Events>(events: T) => {
  const entries = Object.entries(events);
  const map = entries.map(([name, event]) => {
    const func = (...parameters: Parameters<typeof event>) => {
      return tryCatch(
        () => event(...parameters),
        (): null => {
          return null;
        },
      );
    };

    return [name, func];
  });

  const protectedEvents = Object.fromEntries(map);
  return protectedEvents;
};

export const protectEventsAsync = <const T extends AsyncEvents>(events: T) => {
  const entries = Object.entries(events);
  const map = entries.map(([name, event]) => {
    const func = (...parameters: Parameters<typeof event>) => {
      return tryCatchAsync(
        () => event(...parameters),
        async (): Promise<null> => {
          return null;
        },
      );
    };

    return [name, func];
  });

  const protectedEvents = Object.fromEntries(map);
  return protectedEvents;
};

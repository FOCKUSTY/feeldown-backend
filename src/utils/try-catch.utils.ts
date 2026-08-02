import { HttpException, HttpStatus } from "@nestjs/common";

export const tryCatch = <T, P>(
  tryFunc: () => T,
  catchFunc: (error: unknown) => P,
): T | P => {
  try {
    return tryFunc();
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    return catchFunc(error);
  }
};

export const tryCatchThrow = <T>(
  tryFunc: () => T,
  onError?: (error: unknown) => void,
): T => {
  return tryCatch(tryFunc, (error: unknown) => {
    onError?.(error);
    throw new HttpException(
      "Internal server error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      {
        cause: error,
      },
    );
  });
};

export const tryCatchNull = <T>(
  tryFunc: () => T,
  onError?: (error: unknown) => void,
): T | null => {
  return tryCatch(tryFunc, (error: unknown): null => {
    onError?.(error);
    return null;
  });
};

export const tryCatchNullPromise = <T>(
  tryFunc: () => Promise<T>,
  onError?: (error: unknown) => void,
): Promise<T | null> => {
  return tryCatchNullPromise(tryFunc, async (error: unknown): Promise<null> => {
    onError?.(error);
    return null;
  });
};

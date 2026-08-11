import { HttpException, HttpStatus } from "@nestjs/common";

export const tryCatch = <T, P>(
  tryFunc: () => T,
  catchFunc: (error: unknown) => P,
): T | P => {
  try {
    return tryFunc();
  } catch (error) {
    return catchFunc(error);
  }
};

export const tryCatchAsync = async <T, P>(
  tryFunc: () => Promise<T>,
  catchFunc: (error: unknown) => Promise<P>,
): Promise<T | P> => {
  try {
    const result = await tryFunc();
    return result;
  } catch (error) {
    const result = await catchFunc(error);
    return result;
  }
};

export const tryCatchThrow = <T>(
  tryFunc: () => T,
  onError?: (error: unknown) => void,
): T => {
  try {
    return tryFunc();
  } catch (error) {
    onError?.(error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      "Internal server error",
      HttpStatus.INTERNAL_SERVER_ERROR,
      {
        cause: error,
      },
    );
  }
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

export const tryCatchNullAsync = <T>(
  tryFunc: () => Promise<T>,
  onError?: (error: unknown) => void,
): Promise<T | null> => {
  return tryCatchAsync(tryFunc, async (error: unknown): Promise<null> => {
    onError?.(error);
    return null;
  });
};

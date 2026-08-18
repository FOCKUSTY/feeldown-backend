import { Injectable } from "@nestjs/common";

export const logger = {
  execute(text: string) {
    console.log("[BAD]: " + text);
  },
  error(...errors: unknown[]) {
    console.error(...errors);
  }
}

@Injectable()
export class LoggerService {
  public constructor() {}

  public execute(text: string) {
    return logger.execute(text);
  }

  public error(...errors: unknown[]) {
    return logger.error(...errors);
  }
}

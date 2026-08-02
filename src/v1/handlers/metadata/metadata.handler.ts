import type { MetadataHandlerType } from "@1/types";
import type { ExecutionContext } from "@nestjs/common";

import { Injectable } from "@nestjs/common";

@Injectable()
export class MetadataHandler implements MetadataHandlerType {
  private readonly _handlers: MetadataHandlerType[] = [];

  public constructor() {}

  public apply(...handlers: MetadataHandlerType[]) {
    this._handlers.push(...handlers);
    return this;
  }

  public async execute(context: ExecutionContext) {
    for (const handler of this._handlers) {
      const validated = await handler.execute(context);
      if (validated) {
        return true;
      }
    }

    return false;
  }
}

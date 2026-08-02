import { Metadata } from "@/enums";
import { MetadataHandlerType } from "@1/types";
import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export abstract class AbstractMetadataHandler implements MetadataHandlerType {
  public constructor(protected readonly reflector: Reflector) {}

  public abstract execute(context: ExecutionContext): Promise<boolean>;

  protected get<T>(context: ExecutionContext, metadata: Metadata) {
    return this.reflector.get<T>(metadata, context.getHandler());
  }
}

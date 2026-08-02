import { ExecutionContext } from "@nestjs/common";

export type MetadataHandlerType = {
  execute(context: ExecutionContext): Promise<boolean>;
};

import type { Request } from "express";

import { ExecutionContext } from "@nestjs/common";

import { Metadata } from "@/enums";
import { MePipe } from "@/pipes";
import {
  setMetadataInEnchanter,
  createParameterDecoratorWithRequiredPipes,
} from "@/utils";

export const Me = createParameterDecoratorWithRequiredPipes(
  async (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    return request;
  },
  [MePipe],
  [setMetadataInEnchanter(Metadata.skipAuthGuard, true)],
);

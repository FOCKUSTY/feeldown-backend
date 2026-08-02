import type { Request } from "express";

import { ExecutionContext, SetMetadata } from "@nestjs/common";

import { createParameterDecoratorWithRequiredPipes } from "@/utils";
import { Metadata } from "@/enums";
import { MePipe } from "@/pipes";

export const Me = createParameterDecoratorWithRequiredPipes(
  async (_, context: ExecutionContext) => {
    SetMetadata(Metadata.skipAuthGuard, true);

    const request = context.switchToHttp().getRequest<Request>();
    return request;
  },
  [MePipe],
);

import type { Request } from "express";

import {
  createParamDecorator as createParameterDecorator,
  ExecutionContext,
} from "@nestjs/common";
import { getServerUser } from "@/utils";

export const Me = createParameterDecorator(
  async (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;

    return getServerUser(authorization);
  },
);

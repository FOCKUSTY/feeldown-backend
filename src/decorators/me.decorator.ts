import type { Request } from "express";

import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { getServerUser } from "@/utils/get-server-user.utils";

export const Me = createParamDecorator(async (_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>();
  const authorization = request.headers.authorization;

  return getServerUser(authorization);
});

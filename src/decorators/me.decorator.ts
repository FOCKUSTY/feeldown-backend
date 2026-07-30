import type { Request } from "express";

import {
  createParamDecorator as createParameterDecorator,
  ExecutionContext,
  SetMetadata,
} from "@nestjs/common";

import { HashService, ServerUserService } from "@1/services";
import { prisma, PrismaService } from "@/database";
import { Metadata } from "@/enums";

export const Me = createParameterDecorator(
  async (_, context: ExecutionContext) => {
    SetMetadata(Metadata.skipAuthGuard, true);

    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;
    const { authId, userId, token } =
      HashService.resolveHeaderAuthorizationOrThrow(authorization);

    const service = new ServerUserService(prisma as PrismaService);
    return service.getOrThrow(authId, userId, token);
  },
);

import type { Request } from "express";

import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

import { PrismaService } from "@/database";
import { tryCatchThrow } from "@/utils";

import {
  MetadataHandler,
  PublicHandler,
  SkipAuthGuardHandler,
} from "@1/handlers";

import { AuthGuardService } from "./auth-guard.service";

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly service: AuthGuardService,
    private readonly metadataHandler: MetadataHandler,
    private readonly publicHandler: PublicHandler,
    private readonly skipAuthGuardHandler: SkipAuthGuardHandler,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const metadataValidated = await this.validateMetadata(context);
    if (metadataValidated) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const validate = () => {
      return this.service.validateRequest(request);
    };

    const validated = tryCatchThrow(validate);
    return validated;
  }

  private async validateMetadata(context: ExecutionContext) {
    return this.metadataHandler
      .apply(this.publicHandler, this.skipAuthGuardHandler)
      .execute(context);
  }
}

export const AUTH_GUARD_PROVIDERS = [
  AuthGuardService,
  PrismaService,
  MetadataHandler,
  PublicHandler,
  SkipAuthGuardHandler,
] as const;

export default AuthGuard;

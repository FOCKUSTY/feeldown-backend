import type { CanActivate, ExecutionContext } from "@nestjs/common";
import type { OnlyMeMetadata } from "@/types";
import type { Request } from "express";

import { Metadata } from "@/enums";
import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { HashService, SERVER_USER_PROVIDERS } from "@1/services";
import { UsernameSlugPipe } from "@1/pipes";

import { OnlyMeGuardService } from "./only-me-guard.service";

@Injectable()
export class OnlyMeGuard implements CanActivate {
  public static readonly PROVIDERS = [
    UsernameSlugPipe,
    HashService,
    OnlyMeGuardService,
    ...SERVER_USER_PROVIDERS,
  ] as const;

  public constructor(
    private readonly reflector: Reflector,
    private readonly service: OnlyMeGuardService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const handler = context.getHandler();

    const metadata = this.reflector.get<OnlyMeMetadata>(
      Metadata.isOnlyMe,
      handler,
    );
    if (!metadata) {
      return true;
    }

    const validated = this.service.execute(metadata, request);
    return validated;
  }
}

export const ONLY_ME_GUARD_PROVIDERS = OnlyMeGuard.PROVIDERS;

export default OnlyMeGuard;

import type { Request } from "express";
import type { Observable } from "rxjs";

import { Reflector } from "@nestjs/core";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

import { tryCatchThrow } from "@/utils/try-catch.utils";
import { AuthGuardService } from "./auth-guard.service";

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly service: AuthGuardService,
  ) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      "isPublic",
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const validate = () => {
      return this.service.validateRequest(request);
    };

    const valided = tryCatchThrow(validate);
    return valided;
  }
}

export default AuthGuard;

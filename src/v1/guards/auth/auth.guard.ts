import type { Request } from "express";
import type { OnlyMeMetadata } from "@/types";

import { Reflector } from "@nestjs/core";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

import { Metadata } from "@/enums";
import { tryCatchThrow, getServerUser } from "@/utils";

import { HashService } from "@1/services";
import { SlugPipe } from "@1/pipes";

import { AuthGuardService } from "./auth-guard.service";
import { AUTH_ERRORS } from "@1/errors";

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly service: AuthGuardService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();

    const isPublic = this.reflector.get<boolean>(Metadata.isPublic, handler);
    if (isPublic) {
      return true;
    }

    const onlyMeValided = await this.validateOnlyMe(context);
    if (!onlyMeValided) {
      return false;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const validate = () => {
      return this.service.validateRequest(request);
    };

    const valided = tryCatchThrow(validate);
    return valided;
  }

  private async validateOnlyMe(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const handler = context.getHandler();
    const authorization = request.headers.authorization;
    if (!authorization) {
      return false;
    }

    const metadata = this.reflector.get<OnlyMeMetadata>(
      Metadata.isOnlyMe,
      handler,
    );
    if (!metadata) {
      return true;
    }

    const { parameter, type } = metadata;
    const value = request.params[parameter] as string;
    if (!value) {
      throw AUTH_ERRORS.PARAMETER_IS_NOT_DEFINED.execute({ parameter });
    }

    const { userId } =
      HashService.resolveHeaderAuthorizationOrThrow(authorization);
    if (type === "id") {
      return value === userId;
    }

    if (type === "username") {
      return this.validateUsername(authorization, value);
    }

    if (type === "slug") {
      const { id, username } = new SlugPipe("username").transform(value);
      if (id) {
        return id === userId;
      }

      return this.validateUsername(authorization, username!);
    }

    return false;
  }

  private async validateUsername(authorization: string, username: string) {
    const user = await getServerUser(authorization);
    if (!user) {
      return false;
    }

    return user.user.username === username;
  }
}

export default AuthGuard;

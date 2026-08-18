import type { OnlyMeMetadata } from "@/types";
import type { Request } from "express";

import { Injectable } from "@nestjs/common";
import { UsernameSlugPipe } from "@1/pipes";

import { AUTH_ERRORS, HASH_ERRORS } from "@1/errors";
import { HashService, ServerUserService } from "@1/services";
import { Prefix } from "@1/enums";

@Injectable()
export class OnlyMeGuardService {
  public constructor(
    private readonly slugPipe: UsernameSlugPipe,
    private readonly hash: HashService,
    private readonly serverUserService: ServerUserService,
  ) {}

  public async execute(
    metadata: OnlyMeMetadata,
    request: Request,
  ): Promise<boolean> {
    const {
      params: parameters,
      headers: { authorization },
    } = request;

    if (!authorization) {
      throw HASH_ERRORS.AUTHORIZATION_UNDEFINED.exception;
    }

    const { parameter, type } = metadata;
    const value = parameters[parameter] as string;
    if (!value) {
      throw AUTH_ERRORS.PARAMETER_IS_NOT_DEFINED.execute({ parameter });
    }

    if (value === `${Prefix.username}me`) {
      return true;
    }

    const { userId } =
      this.hash.resolveHeaderAuthorizationOrThrow(authorization);
    if (type === "id") {
      return value === userId;
    }

    if (type === "username") {
      return this.validateUsername(value, request);
    }

    if (type === "slug") {
      const { id, username } = this.slugPipe.transform(value);
      if (id) {
        return id === userId;
      }

      return this.validateUsername(username!, request);
    }

    return false;
  }

  private async validateUsername(username: string, request: Request) {
    const user = await this.serverUserService.getByRequestOrThrow(request);
    return user.user.username === username;
  }
}

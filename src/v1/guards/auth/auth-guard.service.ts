import type { Request } from "express";

import { Injectable } from "@nestjs/common";

import { HashService, ServerUserService } from "@1/services";

@Injectable()
export class AuthGuardService {
  public constructor(private readonly serverUserService: ServerUserService) {}

  public async validateRequest(request: Request) {
    const { authId, userId, token } =
      HashService.resolveHeaderAuthorizationOrThrow(
        request.headers.authorization,
      );

    await this.serverUserService.getOrThrow(authId, userId, token);

    return true;
  }
}

export default AuthGuardService;

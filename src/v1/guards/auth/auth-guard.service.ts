import type { Request } from "express";

import { Injectable } from "@nestjs/common";

import { HashService, ServerUserService } from "@1/services";

@Injectable()
export class AuthGuardService {
  public constructor(private readonly serverUserService: ServerUserService) {}

  public async execute(request: Request) {
    const { authId, userId, token } =
      HashService.resolveHeaderAuthorizationOrThrow(
        request.headers.authorization,
      );

    const user = await this.serverUserService.getOrThrow(authId, userId, token);
    this.serverUserService.setInRequest(request, user);

    return true;
  }
}

export default AuthGuardService;

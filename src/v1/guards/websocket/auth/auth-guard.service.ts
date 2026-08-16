import type { Socket } from "socket.io";

import { HashService, ServerUserService } from "@1/services";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WebSocketAuthGuardService {
  public constructor(private readonly serverUserService: ServerUserService) {}

  public async execute(socket: Socket) {
    const { authId, userId, token } =
      HashService.resolveHeaderAuthorizationOrThrow(
        socket.request.headers.authorization,
      );

    const user = await this.serverUserService.getOrThrow(authId, userId, token);
    this.serverUserService.setInSocket(socket, user);

    return true;
  }
}

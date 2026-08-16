import type { ExecutionContext, CanActivate } from "@nestjs/common";
import type { Socket } from "socket.io";
import { Injectable } from "@nestjs/common";

import { WebSocketAuthGuardService } from "./auth-guard.service";
import { HashService, ServerUserService } from "@1/services";
import { PrismaService } from "@/database";

@Injectable()
export class WebSocketAuthGuard implements CanActivate {
  public constructor(private readonly service: WebSocketAuthGuardService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const websocket = context.switchToWs();
    const client = websocket.getClient<Socket>();

    if (client.data.user) {
      return true;
    }

    return this.service.execute(client);
  }
}

export const WEBSOCKET_AUTH_GUARD_PROVIDERS = [
  WebSocketAuthGuardService,
  ServerUserService,
  PrismaService,
  HashService,
] as const;

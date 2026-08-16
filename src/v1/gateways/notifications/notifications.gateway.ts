import type { Namespace, Socket } from "socket.io";
import type { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { UseGuards } from "@nestjs/common";
import { WebSocketAuthGuard } from "@1/guards";
import { Notification } from "@1/entities";
import { GATEWAYS } from "./notifications.gateways";

@WebSocketGateway({
  cors: {
    origin: "*"
  },
  namespace: "/notifications"
})
@UseGuards(WebSocketAuthGuard)
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public readonly server: Namespace;

  public constructor() {}

  public handleConnection(client: Socket) {
    if (!client.data.user) {
      throw new WsException("Not authorized.");
    }

    const room = this.getPersonalRoom(client);
    client.join(room);
  }

  public handleDisconnect(client: Socket) {
    if (!client.data.user) {
      throw new WsException("Not authorized.");
    }

    const room = this.getPersonalRoom(client);
    client.leave(room);
  }

  public notify(
    userId: string,
    notification: Notification
  ) {
    const room = this.getPersonalRoomByUserId(userId);
    this.server.to(room).emit(GATEWAYS.NOTIFY, notification);
  }

  private getPersonalRoomByUserId(userId: string) {
    return `personal:${userId}`
  }
  
  private getPersonalRoom(client: Socket) {
    return this.getPersonalRoomByUserId(client.data.user.user.id);
  }
}
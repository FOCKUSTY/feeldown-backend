import type { CrudListener, FriendRequest } from "@1/types";

import { FriendRequestStatus } from "@1/types";
import { Events } from "@1/enums";

import { OnEvent } from "@nestjs/event-emitter";
import { Injectable } from "@nestjs/common";

import { FriendshipNotificationsEmitter } from "../notifications";

@Injectable()
export class FriendshipsListener implements CrudListener<
  "afterCreate" | "afterUpdate"
> {
  public constructor(
    private readonly emitter: FriendshipNotificationsEmitter,
  ) {}

  @OnEvent(Events.FRIENDSHIP_REQUEST_CREATED)
  public async afterCreate(request: FriendRequest) {
    await this.emitter.execute(request, FriendRequestStatus.PENDING);
  }

  @OnEvent(Events.FRIENDSHIP_REQUEST_UPDATED)
  public async afterUpdate(request: FriendRequest) {
    if (request.status !== FriendRequestStatus.ACCEPTED) {
      return;
    }

    await this.emitter.execute(request, FriendRequestStatus.ACCEPTED);
  }
}

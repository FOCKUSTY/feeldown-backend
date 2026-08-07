import type { FriendRequest, FriendRequestStatus } from "@1/types";
import { NotificationType, ReferenceType } from "@1/types";

import { Injectable } from "@nestjs/common";

import { BaseNotificationsEmitter } from "./base-notifications.emitter";
import {
  FRIENDSHIP_NOTIFICATIONS_ERRORS,
  FRIENDSHIP_NOTIFICATIONS_SERVER_ERRORS,
} from "@1/errors";

const STATUS_TO_TYPE: Record<FriendRequestStatus, NotificationType | null> = {
  ACCEPTED: NotificationType.FRIEND_ACCEPT,
  PENDING: NotificationType.FRIEND_REQUEST,
  REJECTED: null,
};

@Injectable()
export class FriendshipNotificationsEmitter extends BaseNotificationsEmitter {
  public execute(request: FriendRequest, status: FriendRequestStatus) {
    if (request.status !== status) {
      throw FRIENDSHIP_NOTIFICATIONS_ERRORS.REQUEST_STATUS_MISMATCH.execute({
        requestStatus: request.status,
        status,
      });
    }

    const type = STATUS_TO_TYPE[status];
    if (!type) {
      throw FRIENDSHIP_NOTIFICATIONS_SERVER_ERRORS.BAD_STATUS_TYPE.exception;
    }

    return this.emit(request, type);
  }

  private emit(request: FriendRequest, type: NotificationType) {
    return this.create({
      actorId: request.senderId,
      recipientId: request.receiverId,
      referenceType: ReferenceType.FRIENDS,
      referenceId: request.id,
      type,
    });
  }
}

import type { Follow } from "@1/types";
import { NotificationType, ReferenceType } from "@1/types";

import { BaseNotificationsEmitter } from "./base-notifications.emitter";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FollowNotificationsEmitter extends BaseNotificationsEmitter {
  public execute(follow: Follow) {
    return this.emit(follow);
  }

  private emit(follow: Follow) {
    return this.create({
      actorId: follow.followerId,
      recipientId: follow.followeeId,
      referenceType: ReferenceType.FOLLOW,
      referenceId: follow.id,
      type: NotificationType.FOLLOW,
    });
  }
}

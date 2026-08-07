import type { Comment, Post } from "@1/types";
import { NotificationType, ReferenceType } from "@1/types";

import { BaseNotificationsEmitter } from "./base-notifications.emitter";
import { Injectable } from "@nestjs/common";

export type ActionToType = {
  create: Post;
  reply: Comment;
};

export type CommentAction = keyof ActionToType;

@Injectable()
export class CommentNotificationsEmitter extends BaseNotificationsEmitter {
  public execute<Action extends CommentAction>(
    comment: Comment,
    parent: ActionToType[Action],
  ) {
    return this.emit<Action>(comment, parent);
  }

  private emit<Action extends CommentAction>(
    comment: Comment,
    parent: ActionToType[Action],
  ) {
    return this.create({
      ...this.getTypes(parent),
      actorId: comment.userId,
      recipientId: parent.userId,
      referenceId: parent.id,
    });
  }

  private getTypes(parent: ActionToType[CommentAction]) {
    if ("postname" in parent) {
      return {
        referenceType: ReferenceType.POST,
        type: NotificationType.COMMENT_POST,
      };
    }

    return {
      referenceType: ReferenceType.COMMENT,
      type: NotificationType.REPLY_COMMENT,
    };
  }
}

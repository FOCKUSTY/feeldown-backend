import type { Comment, CommentReaction, Post, PostReaction } from "@1/types";
import { NotificationType, ReferenceType } from "@1/types";

import { BaseNotificationsEmitter } from "./base-notifications.emitter";
import { Injectable } from "@nestjs/common";

export type TargetToType = {
  post: {
    target: Post;
    reaction: PostReaction;
  };
  comment: {
    target: Comment;
    reaction: CommentReaction;
  };
};

export type ReactionTarget = keyof TargetToType;

export const TARGET_TO_TYPE: Record<ReactionTarget, NotificationType> = {
  comment: NotificationType.REACT_COMMENT,
  post: NotificationType.REACT_POST,
};

@Injectable()
export class ReactionNotificationsEmitter extends BaseNotificationsEmitter {
  public execute<Target extends ReactionTarget>(
    data: TargetToType[Target],
    react: ReactionTarget,
  ) {
    return this.emit(data, react);
  }

  private emit<Target extends ReactionTarget>(
    { reaction, target }: TargetToType[Target],
    react: ReactionTarget,
  ) {
    return this.create({
      actorId: reaction.userId,
      recipientId: target.userId,
      referenceId: target.id,
      referenceType: ReferenceType.COMMENT,
      type: TARGET_TO_TYPE[react],
    });
  }
}

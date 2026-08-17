import type { Post } from "@1/types";
import { NotificationType, ReferenceType } from "@1/types";

import { BaseNotificationsEmitter } from "./base-notifications.emitter";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PostNotificationsEmitter extends BaseNotificationsEmitter {
  public async execute(post: Post) {
    const followers = await this.prisma.follow.findMany({
      where: {
        followeeId: post.userId,
      },
      select: {
        followerId: true,
      },
    });

    const promises = followers
      .filter((follower) => follower.followerId !== post.userId)
      .map(({ followerId }) => this.emit(followerId, post.userId, post.id));

    return Promise.all(promises);
  }

  private emit(followerId: string, authorId: string, postId: string) {
    return this.create({
      actorId: authorId,
      recipientId: followerId,
      referenceType: ReferenceType.POST,
      referenceId: postId,
      type: NotificationType.CREATE_POST,
    });
  }
}

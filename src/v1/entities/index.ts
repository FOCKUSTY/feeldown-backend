import { NotificationEntity } from "./notification.entity";
import { ServerUserEntity } from "./server-user.entity";
import { AuthEntity } from "./auth.entity";
import { PostEntity } from "./post.entity";
import { UserEntity } from "./user.entity";
import { FriendRequestEntity } from "./friend-request.entity";
import { FollowEntity } from "./follow.entity";
import { BlockEntity } from "./block.entity";

export * from "./auth.entity";
export * from "./user.entity";
export * from "./post.entity";
export * from "./notification.entity";
export * from "./server-user.entity";
export * from "./friend-request.entity";
export * from "./follow.entity";
export * from "./block.entity";

export const ENTITIES = [
  AuthEntity,
  UserEntity,
  PostEntity,
  NotificationEntity,
  ServerUserEntity,
  FriendRequestEntity,
  FollowEntity,
  BlockEntity,
] as const;

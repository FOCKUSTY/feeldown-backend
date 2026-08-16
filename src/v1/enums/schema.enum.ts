import { Enumeration } from "@/utils";

export const SchemaEnumeration = new Enumeration({
  BLOCK_CREATE: "BlockCreateSchema",
  BLOCK_FILTER: "BlockFilterSchema",
  FOLLOW_CREATE: "FollowCreateSchema",
  FOLLOW_FILTER: "FollowFilterSchema",
  FRIENDSHIP_CREATE: "FriendshipCreateSchema",
  FRIENDSHIP_FILTER: "FriendshipFilterSchema",
  FRIENDSHIP_UPDATE: "FriendshipUpdateSchema",
  POST_CREATE: "PostCreateSchema",
  POST_FILTER: "PostFilterSchema",
  POST_UPDATE: "PostUpdateSchema",
  USER_CREATE: "UserCreateSchema",
  USER_UPDATE: "UserUpdateSchema",
  USER_CREDENTIALS: "UserCredentialsSchema",
  FRIEND_REQUEST: "FriendRequestSchema",
  FOLLOW: "FollowSchema",
  BLOCK: "BlockSchema",
  USER: "UserSchema",
  SERVER_USER: "ServerUserSchema",
  POST: "PostSchema",
  NOTIFICATION: "NotificationSchema",
  AUTH: "AuthSchema",
});

export const Schema = SchemaEnumeration.enumeration;
export type Schema = typeof SchemaEnumeration.type;

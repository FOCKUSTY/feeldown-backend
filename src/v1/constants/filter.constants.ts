import type {
  Block,
  Follow,
  FriendRequest,
  Notification,
  Post,
} from "@1/types";

export const AVAILABLE_SORT_ORDERING = ["asc", "desc"] as const;

export const AVAILABLE_POST_SORT_TYPES = [
  "title",
  "createdAt",
  "updatedAt",
] as const satisfies Array<keyof Post>;

export const AVAILABLE_NOTIFICATION_SORT_TYPES = [
  "createdAt",
  "type",
  "referenceType",
] as const satisfies Array<keyof Notification>;

export const AVAILABLE_FRIENDSHIP_SORT_TYPES = [
  "status",
  "createdAt",
  "updatedAt",
] as const satisfies Array<keyof FriendRequest>;

export const AVAILABLE_FOLLOW_SORT_TYPES = [
  "createdAt",
] as const satisfies Array<keyof Follow>;

export const AVAILABLE_BLOCK_SORT_TYPES = [
  "createdAt",
] as const satisfies Array<keyof Block>;

import type {
  FriendRequestStatus,
  NotificationType,
  ReferenceType,
} from "@/database/generated/client";

import type {
  AVAILABLE_NOTIFICATION_SORT_TYPES,
  AVAILABLE_FRIENDSHIP_SORT_TYPES,
  AVAILABLE_POST_SORT_TYPES,
  AVAILABLE_SORT_ORDERING,
  AVAILABLE_FOLLOW_SORT_TYPES,
  AVAILABLE_BLOCK_SORT_TYPES,
} from "@1/constants";

export type BaseFilter = {
  sort: (typeof AVAILABLE_SORT_ORDERING)[number];
  limit: number;
  offset: number;
};

export type PostFilter = BaseFilter & {
  sortBy: (typeof AVAILABLE_POST_SORT_TYPES)[number];
};

export type NotificationWhere = {
  recipientId: string;
  actorId?: string;
  referenceType?: ReferenceType;
  referenceId?: string;
  readed?: boolean;
  type?: NotificationType;
};

export type NotificationFilter = BaseFilter &
  NotificationWhere & {
    sortBy: (typeof AVAILABLE_NOTIFICATION_SORT_TYPES)[number];
  };

export type FriendshipFilter = BaseFilter & {
  status?: FriendRequestStatus;
  sortBy: (typeof AVAILABLE_FRIENDSHIP_SORT_TYPES)[number];
};

export type FollowFilter = BaseFilter & {
  sortBy: (typeof AVAILABLE_FOLLOW_SORT_TYPES)[number];
};

export type BlockFilter = BaseFilter & {
  sortBy: (typeof AVAILABLE_BLOCK_SORT_TYPES)[number];
};

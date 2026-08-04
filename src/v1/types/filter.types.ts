import type {
  FriendRequestStatus,
  NotificationType,
} from "@/database/generated/client";
import type {
  AVAILABLE_NOTIFICATION_SORT_TYPES,
  AVAILABLE_FRIENDSHIP_SORT_TYPES,
  AVAILABLE_POST_SORT_TYPES,
  AVAILABLE_SORT_ORDERING,
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
  referenceType?: string;
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

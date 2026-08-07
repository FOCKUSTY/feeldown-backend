import type {
  NotificationType,
  ReferenceType,
} from "@/database/generated/client";

export type NotificationCreateType = {
  actorId?: string;
  recipientId: string;
  referenceType: ReferenceType;
  referenceId: string;
  type: NotificationType;
};

import type { NotificationType } from "@/database/generated/client";

export type NotificationCreateType = {
  actorId?: string;
  recipientId: string;
  referenceType: string;
  referenceId: string;
  type: NotificationType;
};

import { serverorFactory } from "@/errors";

export const NOTIFICATIONS_ERRORS = serverorFactory.execute("BLOCK EXCEPTION", {
  CANNOT_NOTIFY_SELF: {
    message: "Нельзя уведомить самому себе",
    description: "Can not notify self",
  },
});

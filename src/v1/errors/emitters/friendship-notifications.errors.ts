import { fockerorFactory, serverorFactory } from "@/errors";
import { HttpStatus } from "@nestjs/common";

export const FRIENDSHIP_NOTIFICATIONS_SERVER_ERRORS = serverorFactory.execute(
  "BLOCK EXCEPTION",
  {
    BAD_STATUS_TYPE: {
      message: "Status type not not supported",
      description: "Не поддерживаемый для уведомления тип статуса",
    },
  },
);

export const FRIENDSHIP_NOTIFICATIONS_ERRORS = fockerorFactory.execute(
  "BLOCK EXCEPTION",
  {
    REQUEST_STATUS_MISMATCH: {
      message:
        "Status mismatch: expected ${{ requestStatus }}, got ${{ status }}",
      description: "Несоответствие статуса запроса и уведомления",
      status: HttpStatus.BAD_REQUEST,
    },
  },
);

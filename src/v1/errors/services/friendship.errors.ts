import { HttpStatus } from "@nestjs/common";
import { fockerorFactory } from "@/errors";

export const FRIENDSHIP_ERRORS = fockerorFactory.execute(
  "FRIENDSHIP EXCEPTION",
  {
    CANNOT_FRIEND_SELF: {
      message: "You cannot send a friend request to yourself",
      description: "Попытка отправить запрос в друзья самому себе",
      status: HttpStatus.BAD_REQUEST,
    },
  },
);

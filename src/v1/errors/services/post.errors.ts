import { HttpStatus } from "@nestjs/common";
import { fockerorFactory } from "@/errors";

export const POST_ERRORS = fockerorFactory.execute("POST EXCEPTION", {
  POST_NOT_FOUND: {
    message: "Post not found",
    description: "Пост не был найден",
    status: HttpStatus.NOT_FOUND,
  },

  NOT_ACCEPTABLE: {
    message: "You do not have permission to edit the post",
    description: "Не хватает прав для изменения поста",
    status: HttpStatus.NOT_ACCEPTABLE,
  },
});

export default POST_ERRORS;

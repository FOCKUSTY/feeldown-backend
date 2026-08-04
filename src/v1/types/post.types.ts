import type { PostUpdateDto } from "@1/routes/posts";

export type UpdatePostData = {
  data: PostUpdateDto;
  userId: string;
};

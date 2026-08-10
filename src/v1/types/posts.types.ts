import type { PostUpdateDto } from "@1/routes/posts";
import { ResolvedPostnameSlug } from "./slug.types";

export type UpdatePostData = {
  data: PostUpdateDto;
  userId: string;
};

export type PostsUpdateInput = {
  where: ResolvedPostnameSlug;
  data: PostUpdateDto;
  meUserId: string;
};

export type PostsDeleteInput = {
  where: { id: string };
  meUserId: string;
};

import type { User } from "@/database/generated/client";
import type { PostUpdateDto } from "@1/routes/posts";
import type { ResolvedPostnameSlug } from "./slug.types";

export type UpdatePostData = {
  where: ResolvedPostnameSlug;
  data: PostUpdateDto;
  user: User;
};

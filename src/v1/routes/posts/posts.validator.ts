import type {
  CrudValidator,
  PostsDeleteInput,
  PostsUpdateInput,
  ResolvedPostnameSlug,
} from "@1/types";

import { PrismaService } from "@/database";
import { POST_ERRORS } from "@1/errors";

export class PostsValidator implements CrudValidator<"update" | "delete"> {
  public constructor(private readonly prisma: PrismaService) {}

  public validateUpdate(input: PostsUpdateInput) {
    return this.canUpdateOrThrow(input.where, input.meUserId);
  }

  public validateDelete(input: PostsDeleteInput) {
    return this.canUpdateOrThrow(input.where, input.meUserId);
  }

  protected async canUpdateOrThrow(
    where: ResolvedPostnameSlug,
    userId: string,
  ): Promise<true> {
    const post = await this.prisma.post.findUnique({ where });
    if (!post) {
      throw POST_ERRORS.POST_NOT_FOUND.exception;
    }

    if (post.userId !== userId) {
      throw POST_ERRORS.NOT_ACCEPTABLE.exception;
    }

    return true;
  }
}

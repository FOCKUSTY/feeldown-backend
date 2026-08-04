import type { PostCreateDto, PostUpdateDto } from "./dto";
import type { PostFilter, ResolvedPostnameSlug } from "@1/types";

import { Injectable } from "@nestjs/common";

import { Compare, CompareAdditional, CrudService } from "@1/services";
import { PrismaService } from "@/database";
import { POST_ERRORS } from "@1/errors";

@Injectable()
export class PostsService extends CrudService<
  "Post",
  Compare<
    "Post",
    {
      get: PostFilter;
      getOne: ResolvedPostnameSlug;
      create: PostCreateDto & { userId: string };
      update: [ResolvedPostnameSlug, PostUpdateDto];
    }
  >,
  CompareAdditional<{
    update: [string];
    delete: [string];
  }>
> {
  public constructor(protected readonly prisma: PrismaService) {
    super(prisma.post);
  }

  public async update(
    where: ResolvedPostnameSlug,
    data: PostUpdateDto,
    userId: string,
  ) {
    await this.canUpdateOrThrow(where, userId);
    return this.prisma.post.update({ where, data });
  }

  public async delete(where: { id: string }, userId: string) {
    await this.canUpdateOrThrow(where, userId);
    return this.prisma.post.delete({ where });
  }

  private async canUpdateOrThrow(
    where: ResolvedPostnameSlug,
    userId: string,
  ): Promise<boolean> {
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

export default PostsService;

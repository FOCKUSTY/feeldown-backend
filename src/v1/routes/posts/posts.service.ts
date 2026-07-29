import type {
  PostFilter,
  ResolvedPostnameSlug,
  UpdatePostData,
} from "@1/types";
import type { Post, User } from "@1/entities";
import type { PostCreateDto } from "./dto";

import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database";
import { POST_ERRORS } from "@1/errors";

@Injectable()
export class PostsService {
  public constructor(private readonly prisma: PrismaService) {}

  public async get(filter: PostFilter): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      skip: filter.offset,
      take: filter.limit,
      orderBy: {
        [filter.sortBy]: filter.sort,
      },
    });

    return posts;
  }

  public async getOne(where: ResolvedPostnameSlug): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({ where });
    return post;
  }

  public async post(user: User, data: PostCreateDto): Promise<Post> {
    const post = await this.prisma.post.create({
      data: {
        userId: user.id,
        ...data,
      },
    });

    return post;
  }

  public async put({ data, user, where }: UpdatePostData): Promise<Post> {
    this.canUpdateOrThrow(where, user);

    const post = await this.prisma.post.update({ where, data });
    return post;
  }

  public async patch({ data, user, where }: UpdatePostData): Promise<Post> {
    return this.put({ where, user, data });
  }

  public async delete(id: string, user: User) {
    const where = { id };
    this.canUpdateOrThrow(where, user);

    return this.prisma.post.delete({ where });
  }

  private async canUpdateOrThrow(
    where: ResolvedPostnameSlug,
    user: User,
  ): Promise<boolean> {
    const post = await this.prisma.post.findUnique({ where });
    if (!post) {
      throw POST_ERRORS.POST_NOT_FOUND.exception;
    }

    if (post.userId !== user.id) {
      throw POST_ERRORS.NOT_ACCEPTABLE.exception;
    }

    return true;
  }
}

export default PostsService;

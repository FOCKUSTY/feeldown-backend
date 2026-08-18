import type {
  PostsDeleteInput,
  PostsUpdateInput,
  ResolvedPostnameSlug,
} from "@1/types";

import { EventEmitter2 as EventEmitter } from "@nestjs/event-emitter";
import { Injectable } from "@nestjs/common";

import { Events } from "@1/enums";
import { CrudService } from "@1/services";
import { PrismaService } from "@/database";

import { PostsValidator } from "./posts.validator";
import { PostCreateDto } from "./dto";

import { v7 as uuid } from "uuid";

@Injectable()
export class PostsService extends CrudService<
  "Post",
  {
    create: PostCreateDto & { userId: string };
    update: PostsUpdateInput;
    delete: PostsDeleteInput;
  }
> {
  public constructor(
    protected readonly prisma: PrismaService,
    emitter: EventEmitter,
    validator: PostsValidator,
  ) {
    super(prisma.post, {
      modificators: {
        where: {
          update: (data) => data.where,
          delete: (data) => data.where,
        },
      },
      validatorsOrThrow: validator,
      events: {
        afterCreate: async (input) => {
          emitter.emit(Events.POST_CREATED, input.result);
        },
      },
    });
  }

  public async getOneWithUser(where: ResolvedPostnameSlug, meUserId?: string) {
    const post = await this.prisma.post.findUniqueOrThrow({
      where,
      include: {
        user: true,
      },
    });

    return {
      ...post,
      isAuthor: meUserId === post.userId,
    };
  }

  public create(data: PostCreateDto & { userId: string }) {
    return super.create({
      postname: data.postname ?? uuid(),
      ...data,
    });
  }
}

export default PostsService;

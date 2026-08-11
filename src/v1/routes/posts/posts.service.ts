import type { PostsDeleteInput, PostsUpdateInput } from "@1/types";

import { Injectable } from "@nestjs/common";

import { CrudService } from "@1/services";
import { PrismaService } from "@/database";

import { PostsValidator } from "./posts.validator";
import { PostCreateDto } from "./dto";

import { v4 as uuid } from "uuid";

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
    });
  }

  public create(data: PostCreateDto & { userId: string }) {
    return super.create({
      postname: uuid(),
      ...data,
    });
  }
}

export default PostsService;

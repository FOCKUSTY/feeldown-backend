import type { PostsDeleteInput, PostsUpdateInput } from "@1/types";

import { Injectable } from "@nestjs/common";

import { CrudService } from "@1/services";
import { PrismaService } from "@/database";

import { PostsValidator } from "./posts.validator";

@Injectable()
export class PostsService extends CrudService<
  "Post",
  {
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
}

export default PostsService;

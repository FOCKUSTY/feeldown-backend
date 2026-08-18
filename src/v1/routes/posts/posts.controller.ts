import type { ResolvedPostnameSlug, ServerUser } from "@1/types";

import {
  Controller,
  Injectable,
  Get,
  Param as Parameter,
  Post,
  Body,
  Delete,
  Put,
  Patch,
} from "@nestjs/common";

import { PostnameSlugPipe } from "@1/pipes";
import { Parameters } from "@1/enums";
import {
  ApiDocumentation,
  Me,
  OptionalMe,
  Public,
  Queries,
} from "@/decorators";

import { PostCreateDto, PostUpdateDto, PostsFilterDto } from "./dto";

import { ROUTE, ROUTES, OPERATIONS } from "./posts.routes";
import { PostsService as Service } from "./posts.service";

@Injectable()
@Controller(ROUTE)
export class PostsController {
  public constructor(private readonly service: Service) {}

  @ApiDocumentation(OPERATIONS.GET)
  @Get(ROUTES.GET)
  @Public()
  public async get(@Queries(PostsFilterDto) query: PostsFilterDto) {
    return this.service.get(query);
  }

  @ApiDocumentation(OPERATIONS.GET_ONE)
  @Get(ROUTES.GET_ONE)
  @Public()
  public getOne(
    @Parameter(Parameters.slug, PostnameSlugPipe)
    where: ResolvedPostnameSlug,
    @OptionalMe() me?: ServerUser,
  ) {
    return this.service.getOneWithUser(where, me?.user.id);
  }

  @ApiDocumentation(OPERATIONS.POST)
  @Post(ROUTES.POST)
  public post(@Body() data: PostCreateDto, @Me() me: ServerUser) {
    return this.service.create({ ...data, userId: me.user.id });
  }

  @ApiDocumentation(OPERATIONS.PUT)
  @Put(ROUTES.PUT)
  public put(
    @Parameter(Parameters.slug, PostnameSlugPipe)
    where: ResolvedPostnameSlug,
    @Body() data: PostUpdateDto,
    @Me() me: ServerUser,
  ) {
    return this.service.update({
      where,
      data,
      meUserId: me.user.id,
    });
  }

  @ApiDocumentation(OPERATIONS.PATCH)
  @Patch(ROUTES.PATCH)
  public patch(
    @Parameter(Parameters.slug, PostnameSlugPipe)
    where: ResolvedPostnameSlug,
    @Body() data: PostUpdateDto,
    @Me() me: ServerUser,
  ) {
    return this.service.update({
      where,
      data,
      meUserId: me.user.id,
    });
  }

  @ApiDocumentation(OPERATIONS.DELETE)
  @Delete(ROUTES.DELETE)
  public delete(@Parameter(Parameters.id) id: string, @Me() me: ServerUser) {
    return this.service.delete({
      where: { id },
      meUserId: me.user.id,
    });
  }
}

export default PostsController;

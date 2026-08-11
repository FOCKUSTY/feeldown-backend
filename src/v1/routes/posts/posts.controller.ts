import type { ResolvedPostnameSlug, ServerUser } from "@1/types";

import { ApiOperation } from "@nestjs/swagger";
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

import { Me, Public, Queries } from "@/decorators";
import { PostnameSlugPipe } from "@1/pipes";
import { Parameters } from "@1/enums";

import { PostCreateDto, PostUpdateDto, PostsFilterDto } from "./dto";

import { ROUTE, ROUTES, OPERATIONS } from "./posts.routes";
import { PostsService as Service } from "./posts.service";

@Injectable()
@Controller(ROUTE)
export class PostsController {
  public constructor(private readonly service: Service) {}

  @ApiOperation(OPERATIONS.GET)
  @Get(ROUTES.GET)
  @Public()
  public get(@Queries(PostsFilterDto) query: PostsFilterDto) {
    return this.service.get(query);
  }

  @ApiOperation(OPERATIONS.GET_ONE)
  @Get(ROUTES.GET_ONE)
  @Public()
  public getOne(
    @Parameter(Parameters.slug, PostnameSlugPipe)
    where: ResolvedPostnameSlug,
  ) {
    return this.service.getOne(where);
  }

  @ApiOperation(OPERATIONS.POST)
  @Post(ROUTES.POST)
  public post(@Body() data: PostCreateDto, @Me() me: ServerUser) {
    return this.service.create({ ...data, userId: me.user.id });
  }

  @ApiOperation(OPERATIONS.PUT)
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

  @ApiOperation(OPERATIONS.PATCH)
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

  @ApiOperation(OPERATIONS.DELETE)
  @Delete(ROUTES.DELETE)
  public delete(@Parameter(Parameters.id) id: string, @Me() me: ServerUser) {
    return this.service.delete({
      where: { id },
      meUserId: me.user.id,
    });
  }
}

export default PostsController;

import type { PostFilter, ResolvedPostnameSlug, ServerUser } from "@1/types";

import {
  Controller,
  Injectable,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { Me, Public, Update } from "@/decorators";
import { Parameters, Queries } from "@1/enums";
import { SlugPipe, SortByPipe, SortOrderingPipe } from "@1/pipes";

import { PostCreateDto, PostUpdateDto } from "./dto";

import { ROUTE, ROUTES, OPERATIONS } from "./posts.routes";
import { PostsService as Service } from "./posts.service";

@Injectable()
@Controller(ROUTE)
export class PostsController {
  public constructor(private readonly service: Service) {}

  @ApiOperation(OPERATIONS.GET)
  @Get(ROUTES.GET)
  @Public()
  public get(
    @Query(Queries.limit, ParseIntPipe) limit: number,
    @Query(Queries.offset, ParseIntPipe) offset: number,
    @Query(Queries.sort, SortOrderingPipe) sort: PostFilter["sort"],
    @Query(Queries.sortBy, SortByPipe) sortBy: PostFilter["sortBy"],
  ) {
    return this.service.get({
      limit,
      offset,
      sort,
      sortBy,
    });
  }

  @ApiOperation(OPERATIONS.GET_ONE)
  @Get(ROUTES.GET_ONE)
  @Public()
  public getOne(
    @Param(Parameters.slug, new SlugPipe("postname"))
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
  @ApiOperation(OPERATIONS.PATCH)
  @Update([ROUTES.PUT, ROUTES.PATCH])
  public update(
    @Param(Parameters.slug, new SlugPipe("postname"))
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
  public delete(@Param(Parameters.id) id: string, @Me() me: ServerUser) {
    return this.service.delete({
      where: { id },
      meUserId: me.user.id,
    });
  }
}

export default PostsController;

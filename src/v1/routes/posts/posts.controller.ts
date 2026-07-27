import type { Filter, ResolvedPostnameSlug, ServerUser } from "@1/types";

import {
  Controller,
  Injectable,
  Get,
  Param,
  Post,
  Body,
  Put,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { Me, Public } from "@/decorators";
import { Params, Queries } from "@1/enums";
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
    @Query(Queries.sort, SortOrderingPipe) sort: Filter["sort"],
    @Query(Queries.sortBy, SortByPipe) sortBy: Filter["sortBy"],
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
    @Param(Params.slug, new SlugPipe("postname")) where: ResolvedPostnameSlug,
  ) {
    return this.service.getOne(where);
  }

  @ApiOperation(OPERATIONS.POST)
  @Post(ROUTES.POST)
  public post(@Body() data: PostCreateDto, @Me() me: ServerUser) {
    return this.service.post(me.user, data);
  }

  @ApiOperation(OPERATIONS.PUT)
  @Put(ROUTES.PUT)
  public put(
    @Param(Params.slug, new SlugPipe("postname")) where: ResolvedPostnameSlug,
    @Body() data: PostUpdateDto,
    @Me() me: ServerUser,
  ) {
    return this.service.put({ where, data, user: me.user });
  }

  @ApiOperation(OPERATIONS.PATCH)
  @Patch(ROUTES.PATCH)
  public patch(
    @Param(Params.slug, new SlugPipe("postname")) where: ResolvedPostnameSlug,
    @Body() data: PostUpdateDto,
    @Me() me: ServerUser,
  ) {
    return this.service.patch({ where, data, user: me.user });
  }

  @ApiOperation(OPERATIONS.DELETE)
  @Delete(ROUTES.DELETE)
  public delete(@Param(Params.id) id: string, @Me() me: ServerUser) {
    return this.service.delete(id, me.user);
  }
}

export default PostsController;

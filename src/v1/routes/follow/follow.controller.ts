import type { ServerUser } from "@1/types";

import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param as Parameter,
  UseGuards,
} from "@nestjs/common";

import { ApiDocumentation, Me, NoCache, Queries } from "@/decorators";
import { AuthGuard } from "@1/guards";

import { ROUTE, ROUTES, OPERATIONS } from "./follow.routes";
import { FollowService } from "./follow.service";

import { FollowCreateDto, FollowFilterDto } from "./dto";
import { Parameters } from "@1/enums";
import { FollowDeleteDto } from "./dto/follow-delete.dto";

@Controller(ROUTE)
@UseGuards(AuthGuard)
export class FollowController {
  public constructor(private readonly service: FollowService) {}

  @NoCache()
  @ApiDocumentation(OPERATIONS.GET)
  @Get(ROUTES.GET)
  public get(
    @Queries(FollowFilterDto) query: FollowFilterDto,
    @Me() me: ServerUser,
  ) {
    return this.service.get({
      ...query,
      where: {
        followerId: me.user.id,
      },
    });
  }

  @NoCache()
  @ApiDocumentation(OPERATIONS.GET_FOLLOWERS)
  @Get(ROUTES.GET_FOLLOWERS)
  public getFollowers(
    @Queries(FollowFilterDto) query: FollowFilterDto,
    @Me() me: ServerUser,
  ) {
    return this.service.getFollowers(query, me.user.id);
  }

  @NoCache()
  @ApiDocumentation(OPERATIONS.GET_FOLLOWING)
  @Get(ROUTES.GET_FOLLOWING)
  public getFollowing(
    @Queries(FollowFilterDto) query: FollowFilterDto,
    @Me() me: ServerUser,
  ) {
    return this.service.getFollowing(query, me.user.id);
  }

  @ApiDocumentation(OPERATIONS.GET_ONE)
  @Get(ROUTES.GET_ONE)
  public getOne(@Parameter(Parameters.id) id: string) {
    return this.service.getOne({ id });
  }

  @ApiDocumentation(OPERATIONS.POST)
  @Post(ROUTES.POST)
  public post(@Body() data: FollowCreateDto, @Me() me: ServerUser) {
    return this.service.create({
      ...data,
      followerId: me.user.id,
    });
  }

  @ApiDocumentation(OPERATIONS.DELETE_BY_USER)
  @Delete(ROUTES.DELETE_BY_USER)
  public deleteByUser(
    @Queries(FollowDeleteDto) query: FollowDeleteDto,
    @Me() me: ServerUser,
  ) {
    return this.service.deleteByUser(me.user.id, query.userId);
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

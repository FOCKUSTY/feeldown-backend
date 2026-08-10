import type { ServerUser } from "@1/types";

import { ApiOperation } from "@nestjs/swagger";
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
} from "@nestjs/common";

import { Me, UseQueryValidation } from "@/decorators";
import { AuthGuard } from "@1/guards";

import { ROUTE, ROUTES, OPERATIONS } from "./follow.routes";
import { FollowService } from "./follow.service";

import { FollowCreateDto, FollowFilterDto } from "./dto";

@Controller(ROUTE)
@UseGuards(AuthGuard)
export class FollowController {
  public constructor(private readonly service: FollowService) {}

  @ApiOperation(OPERATIONS.GET)
  @Get(ROUTES.GET)
  public get(
    @UseQueryValidation(FollowFilterDto) query: FollowFilterDto,
    @Me() me: ServerUser,
  ) {
    return this.service.get({
      ...query,
      where: {
        followerId: me.user.id,
      },
    });
  }

  @ApiOperation(OPERATIONS.GET_FOLLOWERS)
  @Get(ROUTES.GET_FOLLOWERS)
  public getFollowers(
    @UseQueryValidation(FollowFilterDto) query: FollowFilterDto,
    @Me() me: ServerUser,
  ) {
    return this.service.getFollowers(query, me.user.id);
  }

  @ApiOperation(OPERATIONS.GET_FOLLOWING)
  @Get(ROUTES.GET_FOLLOWING)
  public getFollowing(
    @UseQueryValidation(FollowFilterDto) query: FollowFilterDto,
    @Me() me: ServerUser,
  ) {
    return this.service.getFollowing(query, me.user.id);
  }

  @ApiOperation(OPERATIONS.GET_ONE)
  @Get(ROUTES.GET_ONE)
  public getOne(@Param("id") id: string) {
    return this.service.getOne({ id });
  }

  @ApiOperation(OPERATIONS.POST)
  @Post(ROUTES.POST)
  public post(@Body() data: FollowCreateDto, @Me() me: ServerUser) {
    return this.service.create({
      ...data,
      followerId: me.user.id,
    });
  }

  @ApiOperation(OPERATIONS.DELETE)
  @Delete(ROUTES.DELETE)
  public delete(@Param("id") id: string, @Me() me: ServerUser) {
    return this.service.delete({
      where: { id },
      meUserId: me.user.id,
    });
  }
}

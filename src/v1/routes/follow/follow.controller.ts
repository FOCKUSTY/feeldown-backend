import type { ServerUser } from "@1/types";

import { ApiOperation } from "@nestjs/swagger";
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param as Parameter,
  UseGuards,
  Query,
} from "@nestjs/common";

import { Me } from "@/decorators";
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
  public get(@Query() query: FollowFilterDto, @Me() me: ServerUser) {
    return this.service.get({
      ...query,
      where: {
        followerId: me.user.id,
      },
    });
  }

  @ApiOperation(OPERATIONS.GET_FOLLOWERS)
  @Get(ROUTES.GET_FOLLOWERS)
  public getFollowers(@Query() query: FollowFilterDto, @Me() me: ServerUser) {
    return this.service.getFollowers(query, me.user.id);
  }

  @ApiOperation(OPERATIONS.GET_FOLLOWING)
  @Get(ROUTES.GET_FOLLOWING)
  public getFollowing(@Query() query: FollowFilterDto, @Me() me: ServerUser) {
    return this.service.getFollowing(query, me.user.id);
  }

  @ApiOperation(OPERATIONS.GET_ONE)
  @Get(ROUTES.GET_ONE)
  public getOne(@Parameter("id") id: string) {
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
  public delete(@Parameter("id") id: string, @Me() me: ServerUser) {
    return this.service.delete({
      where: { id },
      meUserId: me.user.id,
    });
  }
}

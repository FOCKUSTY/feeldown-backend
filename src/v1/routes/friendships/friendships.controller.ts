import type { ServerUser } from "@1/types";

import { ApiOperation } from "@nestjs/swagger";
import {
  Controller,
  Injectable,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Query,
} from "@nestjs/common";

import { Me, Update, UseQueryValidation } from "@/decorators";
import { Parameters } from "@1/enums";
import { AuthGuard } from "@1/guards";

import {
  FriendshipCreateDto,
  FriendshipUpdateDto,
  FriendshipFilterDto,
} from "./dto";

import { ROUTE, ROUTES, OPERATIONS } from "./friendships.routes";
import { FriendshipsService as Service } from "./friendships.service";

@Injectable()
@Controller(ROUTE)
@UseGuards(AuthGuard)
export class FriendshipsController {
  public constructor(private readonly service: Service) {}

  @ApiOperation(OPERATIONS.GET)
  @Get(ROUTES.GET)
  public get(
    @UseQueryValidation(FriendshipFilterDto) query: FriendshipFilterDto,
    @Me() me: ServerUser,
  ) {
    return this.service.getUsers(query, me.user.id);
  }

  @ApiOperation(OPERATIONS.GET_ONE)
  @Get(ROUTES.GET_ONE)
  public getOne(@Param(Parameters.id) id: string, @Me() me: ServerUser) {
    return this.service.getOne({
      where: { id },
      meUserId: me.user.id,
    });
  }

  @ApiOperation(OPERATIONS.POST)
  @Post(ROUTES.POST)
  public post(@Body() data: FriendshipCreateDto, @Me() me: ServerUser) {
    return this.service.create({
      senderId: me.user.id,
      ...data,
    });
  }

  @ApiOperation(OPERATIONS.PUT)
  @ApiOperation(OPERATIONS.PATCH)
  @Update([ROUTES.PUT, ROUTES.PATCH])
  public update(
    @Param(Parameters.id) id: string,
    @Query() data: FriendshipUpdateDto,
    @Me() me: ServerUser,
  ) {
    return this.service.update({
      where: { id },
      data,
      meUserId: me.user.id,
    });
  }
}

export default FriendshipsController;

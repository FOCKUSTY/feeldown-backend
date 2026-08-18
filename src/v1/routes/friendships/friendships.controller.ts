import type { ServerUser } from "@1/types";

import {
  Controller,
  Injectable,
  Get,
  Param as Parameter,
  Post,
  Body,
  UseGuards,
  Put,
  Patch,
  Delete,
} from "@nestjs/common";

import { ApiDocumentation, Me, Queries, UserFindOptions } from "@/decorators";
import { Parameters } from "@1/enums";
import { AuthGuard } from "@1/guards";

import {
  FriendshipCreateDto,
  FriendshipUpdateDto,
  FriendshipFilterDto,
  FriendshipDeleteDto,
} from "./dto";

import { ROUTE, ROUTES, OPERATIONS } from "./friendships.routes";
import { FriendshipsService as Service } from "./friendships.service";
import { ResolvedSlugToIdPipe } from "@1/pipes";

@Injectable()
@Controller(ROUTE)
@UseGuards(AuthGuard)
export class FriendshipsController {
  public constructor(private readonly service: Service) {}

  @ApiDocumentation(OPERATIONS.GET_USER_FRIENDS)
  @Get(ROUTES.GET_USER_FRIENDS)
  public getUserFriends(
    @Queries(FriendshipFilterDto) query: FriendshipFilterDto,
    @UserFindOptions(Parameters.userSlug, ResolvedSlugToIdPipe) id: string,
  ) {
    return this.service.getUsers(query, id);
  }

  @ApiDocumentation(OPERATIONS.GET)
  @Get(ROUTES.GET)
  public get(
    @Queries(FriendshipFilterDto) query: FriendshipFilterDto,
    @Me() me: ServerUser,
  ) {
    return this.service.getMany(query, me.user.id);
  }

  @ApiDocumentation(OPERATIONS.GET_ONE_BY_USER)
  @Get(ROUTES.GET_ONE_BY_USER)
  public getOneByUser(
    @Parameter(Parameters.userId) userId: string,
    @Me() me: ServerUser,
  ) {
    return this.service.getByUsers(userId, me.user.id);
  }

  @ApiDocumentation(OPERATIONS.GET_ONE)
  @Get(ROUTES.GET_ONE)
  public getOne(@Parameter(Parameters.id) id: string, @Me() me: ServerUser) {
    return this.service.getOne({
      where: { id },
      meUserId: me.user.id,
    });
  }

  @ApiDocumentation(OPERATIONS.POST)
  @Post(ROUTES.POST)
  public post(@Body() data: FriendshipCreateDto, @Me() me: ServerUser) {
    return this.service.create({
      senderId: me.user.id,
      ...data,
    });
  }

  @ApiDocumentation(OPERATIONS.PUT)
  @Put(ROUTES.PUT)
  public put(
    @Parameter(Parameters.id) id: string,
    @Queries(FriendshipUpdateDto) data: FriendshipUpdateDto,
    @Me() me: ServerUser,
  ) {
    return this.service.update({
      where: { id },
      data,
      meUserId: me.user.id,
    });
  }

  @ApiDocumentation(OPERATIONS.PATCH)
  @Patch(ROUTES.PATCH)
  public patch(
    @Parameter(Parameters.id) id: string,
    @Queries(FriendshipUpdateDto) data: FriendshipUpdateDto,
    @Me() me: ServerUser,
  ) {
    return this.service.update({
      where: { id },
      data,
      meUserId: me.user.id,
    });
  }

  @ApiDocumentation(OPERATIONS.DELETE_BY_USER)
  @Delete(ROUTES.DELETE_BY_USER)
  public deleteByUser(
    @Queries(FriendshipDeleteDto) query: FriendshipDeleteDto,
    @Me() me: ServerUser,
  ) {
    return this.service.deleteByUsers(me.user.id, query.userId);
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

export default FriendshipsController;

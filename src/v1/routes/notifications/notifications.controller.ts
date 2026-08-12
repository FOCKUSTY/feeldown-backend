import type { ServerUser } from "@1/types";

import {
  Controller,
  Injectable,
  Get,
  Param as Parameter,
  UseGuards,
  Query,
  ParseEnumPipe,
  Patch,
  Put,
} from "@nestjs/common";

import { ApiDocumentation, Me, OnlyMe, Public, Queries } from "@/decorators";
import { ACTIONS } from "@1/constants";
import { AuthGuard } from "@1/guards";
import { Parameters } from "@1/enums";

import { NotificationWhereDto, NotificationFilterDto } from "./dto";

import { ROUTE, ROUTES, OPERATIONS } from "./notifications.routes";
import { NotificationsService as Service } from "./notifications.service";

@Injectable()
@Controller(ROUTE)
@UseGuards(AuthGuard)
export class NotificationsController {
  public constructor(private readonly service: Service) {}

  @ApiDocumentation(OPERATIONS.GET)
  @Get(ROUTES.GET)
  @Public()
  public get(
    @Queries(NotificationFilterDto) query: NotificationFilterDto,
    @Me() me: ServerUser,
  ) {
    return this.service.get({
      recipientId: me.user.id,
      ...query,
    });
  }

  @ApiDocumentation(OPERATIONS.GET_ONE)
  @Get(ROUTES.GET_ONE)
  @OnlyMe(Parameters.id, "id")
  public getOne(@Parameter(Parameters.id) id: string) {
    return this.service.getOne({ id });
  }

  @ApiDocumentation(OPERATIONS.GET_COUNT)
  @Get(ROUTES.GET_COUNT)
  public getCount(@Me() me: ServerUser) {
    return this.service.unreadCount(me.user.id);
  }

  @ApiDocumentation(OPERATIONS.PATCH)
  @Patch(ROUTES.PATCH)
  public readPatch(
    @Parameter(Parameters.id) id: string,
    @Query("action", new ParseEnumPipe(ACTIONS))
    action: (typeof ACTIONS)[number],
    @Me() me: ServerUser,
  ) {
    if (action === "read") {
      return this.service.read(id, me.user.id);
    }

    return this.service.unread(id, me.user.id);
  }

  @ApiDocumentation(OPERATIONS.PUT)
  @Put(ROUTES.PUT)
  public readPut(
    @Parameter(Parameters.id) id: string,
    @Query("action", new ParseEnumPipe(ACTIONS))
    action: (typeof ACTIONS)[number],
    @Me() me: ServerUser,
  ) {
    if (action === "read") {
      return this.service.read(id, me.user.id);
    }

    return this.service.unread(id, me.user.id);
  }

  @ApiDocumentation(OPERATIONS.PATCH_MANY)
  @Patch(ROUTES.PATCH_MANY)
  public readManyPatch(
    @Queries(NotificationWhereDto) where: NotificationWhereDto,
    @Query("action", new ParseEnumPipe(ACTIONS))
    action: (typeof ACTIONS)[number],
    @Me() me: ServerUser,
  ) {
    if (action === "read") {
      return this.service.readMany({
        recipientId: me.user.id,
        ...where,
      });
    }

    return this.service.unreadMany({
      recipientId: me.user.id,
      ...where,
    });
  }

  @ApiDocumentation(OPERATIONS.PUT_MANY)
  @Put(ROUTES.PUT_MANY)
  public readManyPut(
    @Queries(NotificationWhereDto) where: NotificationWhereDto,
    @Query("action", new ParseEnumPipe(ACTIONS))
    action: (typeof ACTIONS)[number],
    @Me() me: ServerUser,
  ) {
    if (action === "read") {
      return this.service.readMany({
        recipientId: me.user.id,
        ...where,
      });
    }

    return this.service.unreadMany({
      recipientId: me.user.id,
      ...where,
    });
  }
}

export default NotificationsController;

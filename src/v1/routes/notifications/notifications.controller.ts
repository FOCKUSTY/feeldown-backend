import type { ServerUser } from "@1/types";

import {
  Controller,
  Injectable,
  Get,
  Param as Parameter,
  UseGuards,
  Query,
  ParseEnumPipe,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { Me, OnlyMe, Public, Update, UseQueryValidation } from "@/decorators";
import { Parameters } from "@1/enums";
import { AuthGuard } from "@1/guards";

import { ROUTE, ROUTES, OPERATIONS } from "./notifications.routes";
import { NotificationsService as Service } from "./notifications.service";
import { NotificationWhereDto, NotificationFilterDto } from "./dto";
import { ACTIONS } from "@1/constants/notification.constants";

@Injectable()
@Controller(ROUTE)
@UseGuards(AuthGuard)
export class NotificationsController {
  public constructor(private readonly service: Service) {}

  @ApiOperation(OPERATIONS.GET)
  @Get(ROUTES.GET)
  @Public()
  public get(
    @UseQueryValidation(NotificationFilterDto) query: NotificationFilterDto,
    @Me() me: ServerUser,
  ) {
    return this.service.get({
      recipientId: me.user.id,
      ...query,
    });
  }

  @ApiOperation(OPERATIONS.GET_ONE)
  @Get(ROUTES.GET_ONE)
  @OnlyMe(Parameters.id, "id")
  public getOne(@Parameter(Parameters.id) id: string) {
    return this.service.getOne({ id });
  }

  @ApiOperation(OPERATIONS.GET_COUNT)
  @Get(ROUTES.GET_COUNT)
  public getCount(@Me() me: ServerUser) {
    return this.service.unreadCount(me.user.id);
  }

  @ApiOperation(OPERATIONS.PATCH)
  @ApiOperation(OPERATIONS.PUT)
  @Update([ROUTES.PATCH, ROUTES.PUT])
  public read(
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

  @ApiOperation(OPERATIONS.PATCH_MANY)
  @ApiOperation(OPERATIONS.PUT_MANY)
  @Update([ROUTES.PATCH_MANY, ROUTES.PUT_MANY])
  public readMany(
    @UseQueryValidation(NotificationWhereDto) where: NotificationWhereDto,
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

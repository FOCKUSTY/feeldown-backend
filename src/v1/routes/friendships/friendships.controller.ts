import type { ServerUser } from "@1/types";

import {
  Controller,
  Injectable,
  Get,
  Param,
  Post,
  Body,
  Put,
  Patch,
  UseGuards,
  Query,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { Me, OnlyMe, UseQueryValidation } from "@/decorators";
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
    return this.service.get(query, me.user.id);
  }

  @ApiOperation(OPERATIONS.GET_ONE)
  @Get(ROUTES.GET_ONE)
  @OnlyMe(Parameters.id, "id")
  public getOne(@Param(Parameters.id) id: string) {
    return this.service.getOne(id);
  }

  @ApiOperation(OPERATIONS.POST)
  @Post(ROUTES.POST)
  public post(@Body() data: FriendshipCreateDto, @Me() me: ServerUser) {
    return this.service.post(data, me.user.id);
  }

  @ApiOperation(OPERATIONS.PUT)
  @Put(ROUTES.PUT)
  @OnlyMe(Parameters.id, "id")
  public put(
    @Param(Parameters.id) id: string,
    @Query() data: FriendshipUpdateDto,
  ) {
    return this.service.put(id, data);
  }

  @ApiOperation(OPERATIONS.PATCH)
  @Patch(ROUTES.PATCH)
  @OnlyMe(Parameters.id, "id")
  public patch(
    @Param(Parameters.id) id: string,
    @Query() data: FriendshipUpdateDto,
  ) {
    return this.service.patch(id, data);
  }
}

export default FriendshipsController;

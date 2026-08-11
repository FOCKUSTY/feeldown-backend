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

import { ROUTE, ROUTES, OPERATIONS } from "./block.routes";
import { BlockService } from "./block.service";
import { BlockCreateDto, BlockFilterDto } from "./dto";

@Controller(ROUTE)
@UseGuards(AuthGuard)
export class BlockController {
  public constructor(private readonly service: BlockService) {}

  @ApiOperation(OPERATIONS.GET)
  @Get(ROUTES.GET)
  public get(@Query() query: BlockFilterDto, @Me() me: ServerUser) {
    return this.service.get({
      ...query,
      where: {
        blockerId: me.user.id,
      },
    });
  }

  @ApiOperation(OPERATIONS.GET_ONE)
  @Get(ROUTES.GET_ONE)
  public getOne(@Parameter("id") id: string) {
    return this.service.getOne({ id });
  }

  @ApiOperation(OPERATIONS.POST)
  @Post(ROUTES.POST)
  public post(@Body() data: BlockCreateDto, @Me() me: ServerUser) {
    return this.service.create({
      ...data,
      blockerId: me.user.id,
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

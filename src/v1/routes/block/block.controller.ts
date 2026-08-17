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

import { ROUTE, ROUTES, OPERATIONS } from "./block.routes";
import { BlockService } from "./block.service";
import { BlockCreateDto, BlockFilterDto, BlockDeleteDto } from "./dto";

@Controller(ROUTE)
@UseGuards(AuthGuard)
export class BlockController {
  public constructor(private readonly service: BlockService) {}

  @NoCache()
  @ApiDocumentation(OPERATIONS.GET)
  @Get(ROUTES.GET)
  public get(
    @Queries(BlockFilterDto) query: BlockFilterDto,
    @Me() me: ServerUser,
  ) {
    return this.service.get({
      ...query,
      where: {
        blockerId: me.user.id,
      },
    });
  }

  @ApiDocumentation(OPERATIONS.GET_ONE)
  @Get(ROUTES.GET_ONE)
  public getOne(@Parameter("id") id: string) {
    return this.service.getOne({ id });
  }

  @ApiDocumentation(OPERATIONS.POST)
  @Post(ROUTES.POST)
  public post(@Body() data: BlockCreateDto, @Me() me: ServerUser) {
    return this.service.create({
      ...data,
      blockerId: me.user.id,
    });
  }

  @ApiDocumentation(OPERATIONS.DELETE_BY_USER)
  @Delete(ROUTES.DELETE_BY_USER)
  public deleteByUser(
    @Queries(BlockDeleteDto) query: BlockDeleteDto,
    @Me() me: ServerUser,
  ) {
    return this.service.deleteByUser(me.user.id, query.userId);
  }

  @ApiDocumentation(OPERATIONS.DELETE)
  @Delete(ROUTES.DELETE)
  public delete(@Parameter("id") id: string, @Me() me: ServerUser) {
    return this.service.delete({
      where: { id },
      meUserId: me.user.id,
    });
  }
}

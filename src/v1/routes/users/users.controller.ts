import type { ResolvedUsernameSlug } from "@1/types";
import type { ServerUser } from "@1/types/server.types";

import {
  Controller,
  Injectable,
  Get,
  Param,
  Body,
  Put,
  Patch,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { Public, Me, OnlyMe } from "@/decorators";
import { Parameters } from "@1/enums";
import { SlugPipe } from "@1/pipes";
import { AuthGuard } from "@1/guards";

import { UserUpdateDto } from "./dto";

import { ROUTE, ROUTES, OPERATIONS } from "./users.routes";
import { UsersService as Service } from "./users.service";

@Injectable()
@Controller(ROUTE)
@UseGuards(AuthGuard)
export class UsersController {
  public constructor(private readonly service: Service) {}

  @ApiOperation(OPERATIONS.GET_ONE)
  @Get(ROUTES.GET_ONE)
  @Public()
  public getOne(
    @Param(Parameters.slug, new SlugPipe("username"))
    slug: ResolvedUsernameSlug,
    @Me() me: ServerUser,
  ) {
    const where = SlugPipe.resolveMe(slug, me);
    return this.service.getOne(where);
  }

  @ApiOperation(OPERATIONS.PUT)
  @Put(ROUTES.PUT)
  @OnlyMe(Parameters.slug, "slug")
  public put(
    @Param(Parameters.slug, new SlugPipe("username"))
    slug: ResolvedUsernameSlug,
    @Body() data: UserUpdateDto,
    @Me() me: ServerUser,
  ) {
    const where = SlugPipe.resolveMe(slug, me);
    return this.service.put(where, data);
  }

  @ApiOperation(OPERATIONS.PATCH)
  @Patch(ROUTES.PATCH)
  @OnlyMe(Parameters.slug, "slug")
  public patch(
    @Param(Parameters.slug, new SlugPipe("username"))
    slug: ResolvedUsernameSlug,
    @Body() data: UserUpdateDto,
    @Me() me: ServerUser,
  ) {
    const where = SlugPipe.resolveMe(slug, me);
    return this.service.patch(where, data);
  }

  @ApiOperation(OPERATIONS.DELETE)
  @Delete(ROUTES.DELETE)
  @OnlyMe(Parameters.id, "id")
  public delete(@Param(Parameters.id) id: string) {
    return this.service.delete(id);
  }
}

export default UsersController;

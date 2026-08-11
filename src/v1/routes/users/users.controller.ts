import type { ResolvedUsernameSlug } from "@1/types";

import { ApiOperation } from "@nestjs/swagger";
import {
  Controller,
  Injectable,
  Get,
  Param as Parameter,
  Body,
  Delete,
  UseGuards,
  Put,
  Patch,
} from "@nestjs/common";

import { Public, OnlyMe, UserFindOptions } from "@/decorators";
import { Parameters } from "@1/enums";
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
    @UserFindOptions(Parameters.slug) options: ResolvedUsernameSlug,
  ) {
    return this.service.getOne(options);
  }

  @ApiOperation(OPERATIONS.PUT)
  @Put(ROUTES.PUT)
  @ApiOperation(OPERATIONS.PATCH)
  @Patch(ROUTES.PATCH)
  @OnlyMe(Parameters.slug, "slug")
  public update(
    @UserFindOptions(Parameters.slug) options: ResolvedUsernameSlug,
    @Body() data: UserUpdateDto,
  ) {
    return this.service.update({
      where: options,
      data,
    });
  }

  @ApiOperation(OPERATIONS.DELETE)
  @Delete(ROUTES.DELETE)
  @OnlyMe(Parameters.id, "id")
  public delete(@Parameter(Parameters.id) id: string) {
    return this.service.delete({ id });
  }
}

export default UsersController;

import type { ResolvedUsernameSlug } from "@1/types";

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

import {
  Public,
  OnlyMe,
  UserFindOptions,
  ApiDocumentation,
  Queries,
  NoCache,
} from "@/decorators";

import { ResolvedSlugToIdPipe } from "@1/pipes";
import { Parameters } from "@1/enums";
import { AuthGuard } from "@1/guards";

import { UserUpdateDto } from "./dto";

import { ROUTE, ROUTES, OPERATIONS } from "./users.routes";
import { UsersService as Service } from "./users.service";
import { PostsFilterDto, PostsService } from "../posts";

@Injectable()
@Controller(ROUTE)
@UseGuards(AuthGuard)
export class UsersController {
  public constructor(
    private readonly service: Service,
    private readonly postsService: PostsService,
  ) {}

  @NoCache()
  @ApiDocumentation(OPERATIONS.GET_ONE)
  @Get(ROUTES.GET_ONE)
  @Public()
  public getOne(
    @UserFindOptions(Parameters.slug) options: ResolvedUsernameSlug,
  ) {
    return this.service.getOne(options);
  }

  @ApiDocumentation(OPERATIONS.GET_USER_POSTS)
  @Get(ROUTES.GET_USER_POSTS)
  public getUserPosts(
    @UserFindOptions(Parameters.slug, ResolvedSlugToIdPipe) userId: string,
    @Queries(PostsFilterDto) query: PostsFilterDto,
  ) {
    return this.postsService.get({
      ...query,
      where: { userId },
    });
  }

  @ApiDocumentation(OPERATIONS.PUT)
  @Put(ROUTES.PUT)
  @OnlyMe(Parameters.slug, "slug")
  public put(
    @UserFindOptions(Parameters.slug) options: ResolvedUsernameSlug,
    @Body() data: UserUpdateDto,
  ) {
    return this.service.update({
      where: options,
      data,
    });
  }

  @ApiDocumentation(OPERATIONS.PATCH)
  @Patch(ROUTES.PATCH)
  @OnlyMe(Parameters.slug, "slug")
  public patch(
    @UserFindOptions(Parameters.slug) options: ResolvedUsernameSlug,
    @Body() data: UserUpdateDto,
  ) {
    return this.service.update({
      where: options,
      data,
    });
  }

  @ApiDocumentation(OPERATIONS.DELETE)
  @Delete(ROUTES.DELETE)
  @OnlyMe(Parameters.id, "id")
  public delete(@Parameter(Parameters.id) id: string) {
    return this.service.delete({ id });
  }
}

export default UsersController;

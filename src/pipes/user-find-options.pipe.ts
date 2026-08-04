import type { PipeTransform } from "@nestjs/common";
import type { Request } from "express";

import { Injectable } from "@nestjs/common";
import { UsernameSlugPipe } from "@1/pipes";
import { ServerUserService } from "@1/services";

@Injectable()
export class UserFindOptionsPipe implements PipeTransform {
  public constructor(
    private readonly slugPipe: UsernameSlugPipe,
    private readonly service: ServerUserService,
  ) {}

  public async transform({
    value,
    request,
  }: {
    value: string;
    request: Request;
  }) {
    const resolvedSlug = this.slugPipe.transform(value);
    const user = await this.service.getByRequest(request);
    const findOptions = UsernameSlugPipe.resolveMe(resolvedSlug, user?.user.id);
    return findOptions;
  }
}

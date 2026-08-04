import type { Request } from "express";
import { Injectable, PipeTransform } from "@nestjs/common";
import { ServerUserService } from "@1/services";

@Injectable()
export class MePipe implements PipeTransform {
  public constructor(private readonly service: ServerUserService) {}

  public transform(request: Request) {
    return this.service.getByRequestOrThrow(request);
  }
}

@Injectable()
export class OptionalMePipe implements PipeTransform {
  public constructor(private readonly service: ServerUserService) {}

  public transform(request: Request) {
    return this.service.getByRequest(request);
  }
}

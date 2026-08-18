import { Controller, Get, Injectable } from "@nestjs/common";

import { OPERATIONS, ROUTE, ROUTES } from "./ping.routes";
import { ApiDocumentation } from "@/decorators";

@Injectable()
@Controller(ROUTE)
export class PingController {
  public constructor() {}

  @ApiDocumentation(OPERATIONS.GET)
  @Get(ROUTES.GET)
  public get() {
    return "pong";
  }
}

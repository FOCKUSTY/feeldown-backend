import type { NextFunction, Request, Response } from "express";
import type { ServerUser } from "@1/types";

import {
  Controller,
  Get,
  HttpStatus,
  Injectable,
  Next,
  Req,
  Res,
  Post,
  Body,
  Param,
} from "@nestjs/common";

import { ROUTE, ROUTES, OPERATIONS } from "./auth.routes";
import { AuthService } from "./auth.service";

import { UserCreateDto, UserCreateCredentialsDto } from "./dto";

import { Parameters } from "@1/enums";
import { PassportStrategy } from "@1/strategies";
import { Me, NoCache, Headers, ApiDocumentation } from "@/decorators";

@Injectable()
@Controller(ROUTE)
export class AuthController {
  public constructor(
    private readonly service: AuthService,
    private readonly passport: PassportStrategy,
  ) {}

  @ApiDocumentation(OPERATIONS.GET)
  @Get(ROUTES.GET)
  public get() {
    const methods = this.service.getAllMethods();

    return {
      message: `Sorry, but you can't auth without method, try methods below by path: ${ROUTE}${ROUTES.OAUTH2_GET}`,
      abbreviations: methods.abbreviations,
      methods: methods.methods,
    };
  }

  @ApiDocumentation(OPERATIONS.POST)
  @Post(ROUTES.POST)
  public post(
    @Body() body: UserCreateDto,
    @Headers(UserCreateCredentialsDto) credentials: UserCreateCredentialsDto,
  ) {
    return this.service.createUser({
      ...credentials,
      ...body,
    });
  }

  @ApiDocumentation(OPERATIONS.GET_ME)
  @Get(ROUTES.GET_ME)
  @NoCache()
  public getMe(@Me() me: ServerUser) {
    return me;
  }

  @ApiDocumentation(OPERATIONS.OAUTH2_GET)
  @Get(ROUTES.OAUTH2_GET)
  public auth(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param(Parameters.method) method: string,
  ) {
    return this.passport.auth(method, req, res, next);
  }

  @ApiDocumentation(OPERATIONS.OAUTH2_GET_CALLBACK)
  @Get(ROUTES.OAUTH2_GET_CALLBACK)
  public callback(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param(Parameters.method) method: string,
  ) {
    return this.passport.callback(method, req, res, next, (error, data) => {
      if (error || !data) {
        return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const redirectUrl = this.service.getRedirectUrl(data.auth);
      res.redirect(redirectUrl);
    });
  }
}

export default AuthController;

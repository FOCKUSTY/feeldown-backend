import type { ServerUser } from "@1/types";
import type { Request } from "express";

import { Injectable } from "@nestjs/common";

import { tryCatchNullPromise, validateInstanceByClassOrThrow } from "@/utils";
import { SERVER_USER_ERRORS } from "@1/errors";

import { ServerUserEntity } from "@1/entities";
import { PrismaService } from "@/database";
import { HashService } from "./hash.service";

@Injectable()
export class ServerUserService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly hash: HashService,
  ) {}

  public async getOrThrow(
    authId: string,
    userId: string,
    token: string,
  ): Promise<ServerUser> {
    const auth = await this.prisma.auth.findUnique({
      where: {
        id: authId,
      },
    });

    if (!auth) {
      throw SERVER_USER_ERRORS.AUTH_NOT_FOUND.execute();
    }

    if (auth.userId !== userId) {
      throw SERVER_USER_ERRORS.USER_ID.execute();
    }

    if (token !== auth.token) {
      throw SERVER_USER_ERRORS.TOKEN_ERROR.execute();
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: auth.userId,
      },
    });

    if (!user) {
      throw SERVER_USER_ERRORS.USER_NOT_FOUND.execute();
    }

    return { auth, user };
  }

  public get(authId: string, userId: string, token: string) {
    return tryCatchNullPromise(() => this.getOrThrow(authId, userId, token));
  }

  public async getByRequestOrThrow(
    request: Request,
  ): Promise<ServerUserEntity> {
    const serverUser = request.user as ServerUserEntity | undefined;
    if (serverUser) {
      const user = await validateInstanceByClassOrThrow<ServerUser>(
        serverUser,
        ServerUserEntity,
      );
      if (user) {
        return user;
      }
    }

    const { authorization } = request.headers;
    const { authId, userId, token } =
      this.hash.resolveHeaderAuthorizationOrThrow(authorization);
    return this.getOrThrow(authId, userId, token);
  }

  public getByRequest(request: Request): Promise<ServerUser | null> {
    return tryCatchNullPromise(() => this.getByRequestOrThrow(request));
  }
}

export const SERVER_USER_PROVIDERS = [
  ServerUserService,
  PrismaService,
  HashService,
] as const;

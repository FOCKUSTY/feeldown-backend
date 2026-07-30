import type { ServerUser } from "@1/types";

import { PrismaService } from "@/database";
import { SERVER_USER_ERRORS } from "@1/errors";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ServerUserService {
  public constructor(private readonly prisma: PrismaService) {}

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
    try {
      return this.getOrThrow(authId, userId, token);
    } catch {
      return null;
    }
  }
}

export const SERVER_USER_PROVIDERS = [
  ServerUserService,
  PrismaService,
] as const;

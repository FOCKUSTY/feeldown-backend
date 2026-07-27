import type { ServerUserWithToken } from "@1/types";

import { HashService } from "@1/services";
import { prisma } from "@/database";

export const getServerUser = async (
  authorization?: string,
): Promise<ServerUserWithToken | null> => {
  const { authId, userId, succeeded, token } =
    HashService.resolveHeaderAuthorization(authorization);
  if (!succeeded) {
    return null;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const auth = await prisma.auth.findUnique({ where: { id: authId } });

  if (!user || !auth) {
    return null;
  }

  return { auth, user, token };
};

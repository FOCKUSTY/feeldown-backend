import type { ResolvedUsernameSlug } from "@1/types";
import type { User } from "@1/entities";
import type { UserUpdateDto } from "./dto";

import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database";

@Injectable()
export class UsersService {
  public constructor(private readonly prisma: PrismaService) {}

  public async getOne(where: ResolvedUsernameSlug): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where });
    return user;
  }

  public async put(
    where: ResolvedUsernameSlug,
    data: UserUpdateDto,
  ): Promise<User> {
    const user = await this.prisma.user.update({
      where,
      data,
    });

    return user;
  }

  public async patch(
    where: ResolvedUsernameSlug,
    data: UserUpdateDto,
  ): Promise<User> {
    return this.put(where, data);
  }

  public delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}

export default UsersService;

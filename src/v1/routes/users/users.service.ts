import type { ResolvedUsernameSlug } from "@1/types";
import type { UserUpdateDto } from "./dto";

import { Injectable } from "@nestjs/common";

import { CrudService, FunctionsParameters } from "@1/services";
import { PrismaService } from "@/database";

@Injectable()
export class UsersService extends CrudService<
  "User",
  FunctionsParameters<"User"> & {
    getOne: ResolvedUsernameSlug;
    updateWhere: ResolvedUsernameSlug;
    delete: { id: string };
    updateData: UserUpdateDto;
  }
> {
  public constructor(protected readonly prisma: PrismaService) {
    super(prisma.user);
  }
}

export default UsersService;

import { Injectable } from "@nestjs/common";

import { CrudService } from "@1/services";
import { PrismaService } from "@/database";

@Injectable()
export class UsersService extends CrudService<"User"> {
  public constructor(protected readonly prisma: PrismaService) {
    super(prisma.user, CrudService.DEFAULT_DEPENDENCIES);
  }
}

export default UsersService;

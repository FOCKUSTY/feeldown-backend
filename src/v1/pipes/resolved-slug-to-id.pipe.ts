import type { ResolvedUsernameSlug } from "@1/types";
import { Injectable, type PipeTransform } from "@nestjs/common";
import { PrismaService } from "@/database";

@Injectable()
export class ResolvedSlugToIdPipe implements PipeTransform {
  public constructor(private readonly prisma: PrismaService) {}

  public async transform(value: ResolvedUsernameSlug): Promise<string> {
    if (value.id) {
      return value.id;
    }

    return this.getUser(value.username!);
  }

  private async getUser(username: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { username },
    });
    return user.id;
  }
}

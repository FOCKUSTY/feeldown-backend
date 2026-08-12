import type { ResolvedUsernameSlug } from "@1/types";
import type { PipeTransform } from "@nestjs/common";
import { UsersService } from "@1/routes";

export class ResolvedSlugToIdPipe implements PipeTransform {
  public constructor(private readonly userService: UsersService) {}

  public async transform(value: ResolvedUsernameSlug): Promise<string> {
    if (value.id) {
      return value.id;
    }

    return this.getUser(value.username!);
  }

  private async getUser(username: string) {
    const user = await this.userService.getOne({ username });
    return user.id;
  }
}

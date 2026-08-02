import type { ResolvedSlug, ResolvedUsernameSlug, ServerUser } from "@1/types";
import type { PrefixKeys } from "@1/enums";

import { Prefix } from "@1/enums";

import { Injectable, PipeTransform } from "@nestjs/common";
import { UsernamePipe } from "./username.pipe";

@Injectable()
export class SlugPipe<T extends PrefixKeys> implements PipeTransform {
  public static resolveMe(
    resolvedSlug: ResolvedUsernameSlug,
    me: ServerUser,
  ): ResolvedUsernameSlug {
    if (resolvedSlug.username === "me") {
      return {
        id: me.user.id,
        username: undefined,
      };
    }

    return resolvedSlug;
  }

  private readonly _prefix: Prefix;
  private readonly _type: T;

  public constructor(type: T) {
    this._type = type;
    this._prefix = Prefix[type];
  }

  public transform(value: string): ResolvedSlug<T> {
    if (value.startsWith(this._prefix)) {
      const username = value.slice(1);
      const validatedUsername = UsernamePipe.validate(username);
      return this.resolveName(validatedUsername);
    }

    return this.resolveId(value);
  }

  private resolveId(id: string) {
    return {
      id,
      [this._type]: undefined,
    } as ResolvedSlug<T>;
  }

  private resolveName(name: string) {
    return {
      id: undefined,
      [this._type]: name,
    } as ResolvedSlug<T>;
  }
}

@Injectable()
export class UsernameSlugPipe extends SlugPipe<"username"> {
  public constructor() {
    super("username");
  }
}

@Injectable()
export class PostnameSlugPipe extends SlugPipe<"postname"> {
  public constructor() {
    super("postname");
  }
}

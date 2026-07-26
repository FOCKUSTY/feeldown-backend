import type { PrefixKeys } from "@1/enums";
import { Prefix } from "@1/enums";

import { PipeTransform } from "@nestjs/common";
import { UsernamePipe } from "./username.pipe";
import { ResolvedSlug } from "@1/types/slug.types";

export class SlugPipe<const T extends PrefixKeys> implements PipeTransform {
  private readonly _prefix: Prefix;
  private readonly _type: T;

  public constructor(type: T) {
    this._type = type;
    this._prefix = Prefix[type];
  }

  public transform(value: string): ResolvedSlug<T> {
    if (value.startsWith(this._prefix)) {
      const username = value.slice(1);
      const validedUsername = UsernamePipe.validate(username);
      return this.resolveName(validedUsername);
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

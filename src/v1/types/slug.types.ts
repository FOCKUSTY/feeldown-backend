import type { PrefixKeys } from "@1/enums";
import type { Prettify } from "@/types";

export type ResolvedSlug<T extends PrefixKeys> = Prettify<
  | ({
      id: string;
    } & Partial<Record<T, string>>)
  | ({
      id?: string | undefined;
    } & Record<T, string>)
>;

export type ResolvedUsernameSlug = ResolvedSlug<"username">;

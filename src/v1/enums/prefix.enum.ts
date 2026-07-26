import { Enumeration } from "@/utils/enumeration.utils";

const PrefixEnumeration = new Enumeration({
  username: "@",
});

export const Prefix = PrefixEnumeration.enumeration;
export type Prefix = typeof PrefixEnumeration.type;
export type PrefixKeys = keyof typeof Prefix;

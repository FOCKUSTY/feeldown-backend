import { Enumeration } from "@/utils/enumeration.utils";

/**
 * @allowed `a-z`, `A-Z`, `0-9`, `_-.~`
 * @see https://stackoverflow.com/questions/1856785/characters-allowed-in-a-url
 * @see https://en.wikipedia.org/wiki/Percent-encoding#Types_of_URI_characters
 */
const PrefixEnumeration = new Enumeration({
  username: ".",
  postname: "~",
});

export const Prefix = PrefixEnumeration.enumeration;
export type Prefix = typeof PrefixEnumeration.type;
export type PrefixKeys = keyof typeof Prefix;

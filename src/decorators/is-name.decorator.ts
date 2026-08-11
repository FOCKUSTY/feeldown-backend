import { Matches } from "class-validator";
import { env } from "@/services";

export const IsName = () => {
  return Matches(env.AVAILABLE_USERNAME_SYMBOLS);
};

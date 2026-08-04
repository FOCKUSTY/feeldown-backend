import type { ServerUser } from "@1/types";

declare global {
  namespace Express {
    interface User extends ServerUser {}
  }
}

export {};

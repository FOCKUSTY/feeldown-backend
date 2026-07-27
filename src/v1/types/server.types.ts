import type { Auth, User } from "@/database/generated/client";

export type ServerUser = {
  auth: Auth;
  user: User;
};

export type ServerUserWithToken = ServerUser & {
  token: string;
};

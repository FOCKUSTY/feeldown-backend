import { Enumeration } from "@/utils";
import { FriendRequestStatus } from "@1/types";

export const UpdateFriendshipEnumeration = new Enumeration({
  ACCEPTED: FriendRequestStatus.ACCEPTED,
  REJECTED: FriendRequestStatus.REJECTED,
});

export const UpdateFriendship = UpdateFriendshipEnumeration.enumeration;
export type UpdateFriendship = typeof UpdateFriendshipEnumeration.type;

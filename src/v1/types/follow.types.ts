import { FollowCreateDto } from "@1/routes";

export type FollowCreateInput = FollowCreateDto & { followerId: string };
export type FollowDeleteInput = { where: { id: string }; meUserId: string };

import type { BlockCreateDto } from "@1/routes";

export type BlockCreateInput = BlockCreateDto & { blockerId: string };

export type BlockDeleteInput = { where: { id: string }; meUserId: string };

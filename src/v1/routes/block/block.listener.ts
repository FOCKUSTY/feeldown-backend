import type { BlockCreateInput, CrudListener } from "@1/types";

import { Injectable } from "@nestjs/common";
import { FriendshipsService } from "../friendships";
import { FollowService } from "../follow";

@Injectable()
export class BlockListener implements CrudListener<"beforeCreate"> {
  public constructor(
    private readonly followService: FollowService,
    private readonly friendshipsService: FriendshipsService,
  ) {}

  public async beforeCreate(input: BlockCreateInput) {
    const { blockerId, blockedId } = input;

    await this.followService.deleteByUsers(blockerId, blockedId);
    await this.friendshipsService.deleteByUsers(blockerId, blockedId);
  }
}

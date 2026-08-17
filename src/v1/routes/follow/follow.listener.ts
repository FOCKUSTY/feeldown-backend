import type { CrudListener } from "@1/types";
import type { FollowEntity } from "@1/entities";

import { OnEvent } from "@nestjs/event-emitter";
import { Injectable } from "@nestjs/common";

import { FollowNotificationsEmitter } from "../notifications";
import { Events } from "@1/enums";

@Injectable()
export class FollowListener implements CrudListener<"afterCreate"> {
  public constructor(private readonly emitter: FollowNotificationsEmitter) {}

  @OnEvent(Events.FOLLOW_CREATED)
  public async afterCreate(follow: FollowEntity) {
    await this.emitter.execute(follow);
  }
}

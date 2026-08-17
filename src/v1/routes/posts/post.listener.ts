import type { CrudListener } from "@1/types";
import type { PostEntity } from "@1/entities";

import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { PostNotificationsEmitter } from "../notifications";
import { Events } from "@1/enums";

@Injectable()
export class PostListener implements CrudListener<"afterCreate"> {
  public constructor(private readonly emitter: PostNotificationsEmitter) {}

  @OnEvent(Events.POST_CREATED, { async: true })
  public async afterCreate(post: PostEntity) {
    await this.emitter.execute(post);
  }
}

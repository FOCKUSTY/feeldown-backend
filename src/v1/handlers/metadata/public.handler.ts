import type { ExecutionContext } from "@nestjs/common";

import { AbstractMetadataHandler } from "./abstract-metadata-handler";
import { Injectable } from "@nestjs/common";
import { Metadata } from "@/enums";

@Injectable()
export class PublicHandler extends AbstractMetadataHandler {
  public async execute(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.get<boolean>(context, Metadata.isPublic);
    return isPublic;
  }
}

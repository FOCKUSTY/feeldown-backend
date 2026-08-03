import { AbstractMetadataHandler } from "./abstract-metadata-handler";
import { ExecutionContext } from "@nestjs/common";
import { Metadata } from "@/enums";

export class SkipAuthGuardHandler extends AbstractMetadataHandler {
  public async execute(context: ExecutionContext) {
    const skipAuthGuard = this.get<boolean>(context, Metadata.skipAuthGuard);
    console.log({ skipAuthGuard });
    return skipAuthGuard;
  }
}

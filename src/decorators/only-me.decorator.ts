import type { OnlyMeMetadataParameterType } from "@/types";

import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { OnlyMeGuard } from "@1/guards";
import { Metadata } from "@/enums";

export const OnlyMe = (
  parameter: string,
  type?: OnlyMeMetadataParameterType,
) => {
  return applyDecorators(
    SetMetadata(Metadata.isOnlyMe, {
      parameter,
      type: type || "slug",
    }),
    UseGuards(OnlyMeGuard),
  );
};

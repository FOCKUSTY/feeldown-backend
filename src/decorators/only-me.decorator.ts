import { Metadata } from "@/enums";
import { OnlyMeMetadataParameterType } from "@/types/metadata.types";
import { SetMetadata } from "@nestjs/common";

export const OnlyMe = (
  parameter: string,
  type?: OnlyMeMetadataParameterType,
) => {
  return SetMetadata(Metadata.isOnlyMe, {
    parameter,
    type: type || "slug",
  });
};

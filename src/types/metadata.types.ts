export type OnlyMeMetadataParameterType = "id" | "username" | "slug";

export type OnlyMeMetadata = {
  parameter: string;
  type: OnlyMeMetadataParameterType;
};

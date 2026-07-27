import { Metadata } from "@/enums";
import { SetMetadata } from "@nestjs/common";

export const Public = () => SetMetadata(Metadata.isPublic, true);

import { SetMetadata } from "@nestjs/common";
import { Metadata } from "@/enums";

export const Public = () => SetMetadata(Metadata.isPublic, true);

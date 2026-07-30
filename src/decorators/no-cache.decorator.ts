import { SetMetadata } from "@nestjs/common";
import { Metadata } from "@/enums";

export const NoCache = () => SetMetadata(Metadata.cacheDisabled, true);

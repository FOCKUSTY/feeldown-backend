import { Module } from "@nestjs/common";

import { AUTH_GUARD_PROVIDERS } from "./auth";
import { ONLY_ME_GUARD_PROVIDERS } from "./only-me";

@Module({
  providers: [...AUTH_GUARD_PROVIDERS, ...ONLY_ME_GUARD_PROVIDERS],
})
export class GuardsModule {}

export default GuardsModule;

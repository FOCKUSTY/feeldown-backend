import { Module } from "@nestjs/common";

import { PrismaService } from "@/database";
import { AuthGuardService } from "./auth";
import { HashService, ServerUserService } from "../services";

@Module({
  providers: [AuthGuardService, PrismaService, HashService, ServerUserService],
})
export class GuardsModule {}

export default GuardsModule;

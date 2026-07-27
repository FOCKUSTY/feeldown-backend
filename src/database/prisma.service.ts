import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@/database/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "@/services";

const ADAPTER =
  env.PRISMA_CONNECTION_TYPE === "adapter"
    ? new PrismaPg({ connectionString: env.DATABASE_URL })
    : undefined;

const ACCELERATE_URL =
  env.PRISMA_CONNECTION_TYPE === "adapter" ? undefined : env.DATABASE_URL;

const OPTIONS = {
  adapter: ADAPTER,
  accelerateUrl: ACCELERATE_URL,
} as ConstructorParameters<typeof PrismaClient>[0];

export const prisma = new PrismaClient(OPTIONS);

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  public constructor() {
    super(OPTIONS);
  }

  public async onModuleInit() {
    await this.$connect();
  }

  public async onModuleDestroy() {
    await this.$disconnect();
  }
}

export default PrismaService;

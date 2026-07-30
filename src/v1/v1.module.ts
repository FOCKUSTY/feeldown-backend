import type { NestModule, MiddlewareConsumer } from "@nestjs/common";

import { Module } from "@nestjs/common";
import { DocumentBuilder } from "@nestjs/swagger";

import { CacheModule } from "@nestjs/cache-manager";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD, APP_INTERCEPTOR, RouterModule } from "@nestjs/core";

import { LoggerMiddleware } from "./middlewares";

import { HashService, StrategiesService } from "./services";
import { LoggerService, env } from "@/services";
import { createSwaggerConfig } from "@/utils";
import { PrismaService } from "@/database";

import { AuthStrategy } from "./strategies";

import { CustomCacheInterceptor } from "./interceptors";
import { AuthEntity, UserEntity } from "./entities";
import { GuardsModule } from "./guards";
import {
  AuthModule,
  CreateUserDto,
  CreateUserCredentials,
  UsersModule,
  PostsModule,
  NotificationsModule,
  FriendshipsModule,
} from "./routes";

export const v1Modules = [
  AuthModule,
  UsersModule,
  PostsModule,
  NotificationsModule,
  FriendshipsModule,
];
export const v1Swagger = createSwaggerConfig({
  version: "v1",
  document: new DocumentBuilder().setTitle("OPEN API v1 documentation"),
  documentOptions: {
    extraModels: [CreateUserDto, CreateUserCredentials, UserEntity, AuthEntity],
  },
});

@Module({
  imports: [
    ...v1Modules.flatMap((module) => [
      module,
      RouterModule.register([{ path: "v1", module }]),
    ]),
    ThrottlerModule.forRoot([
      {
        ttl: +env.THROLLER_TIME_TO_LIVE_IN_MILLISECONDS,
        limit: +env.THROLLER_LIMIT,
      },
    ]),
    CacheModule.register({
      ttl: +env.CACHE_TIME_TO_LIVE_IN_MILLISECONDS,
      isGlobal: true,
    }),
    GuardsModule,
  ],
  providers: [
    StrategiesService,
    AuthStrategy,
    PrismaService,
    LoggerService,
    HashService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CustomCacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class v1Module implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("/");
  }
}

export default v1Module;

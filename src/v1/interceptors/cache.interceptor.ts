import { Injectable, ExecutionContext } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { Metadata } from "@/enums";

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  protected isRequestCacheable(context: ExecutionContext): boolean {
    const reflector = this.reflector;
    const cacheDisabled = reflector.getAllAndOverride<boolean>(
      Metadata.cacheDisabled,
      [context.getHandler(), context.getClass()],
    );

    if (cacheDisabled) {
      return false;
    }

    return super.isRequestCacheable(context);
  }
}

import { CacheModule } from "@nestjs/cache-manager";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
  imports: [
    CacheModule.register({
      ttl: 0,
      max: 1000,
    }),
  ],
  exports: [CacheModule],
})
export class CacheConfigModule {}

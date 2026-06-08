import { ConfigService } from '@nestjs/config';
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { CacheableMemory } from 'cacheable';
import { Keyv, createKeyv } from '@keyv/redis';

import { ConvertMinutesToMilliseconds } from 'src/utility/time.utility';
import {
  APP_CONSTANTS,
  CONSTANTS_TOKEN,
} from 'src/infastructure/config/constants/constants.config';
import { AppConfig } from 'src/infastructure/config/env/env';

export const cacheModuleConfig = (): CacheModuleAsyncOptions => ({
  isGlobal: true,
  inject: [ConfigService, CONSTANTS_TOKEN],
  useFactory: (
    configService: ConfigService<AppConfig>,
    constants: typeof APP_CONSTANTS,
  ) => {
    const redisUrl = configService.get<string>('redis_url', { infer: true });

    if (!redisUrl) {
      throw new Error(
        '❌ REDIS_URL is not configured. Set it in your .env file.',
      );
    }

    const memoryStore = new Keyv({
      store: new CacheableMemory({
        ttl: ConvertMinutesToMilliseconds(constants.DEFAULT_TTL_IN_MINUTE),
        lruSize: constants.CACHE_LRU_SIZE,
      }),
    });

    const redisStore = createKeyv(redisUrl);

    // Namespace every key written by this app so we don't
    // collide with other services sharing the Redis cluster.
    redisStore.namespace = 'flightiq';

    redisStore.on('error', (err) => {
      // Surface Redis errors in the logs but don't crash the
      // process — cache misses are recoverable.

      console.error('[cache] Redis error:', err);
    });

    return {
      stores: [redisStore, memoryStore],
    };
  },
});

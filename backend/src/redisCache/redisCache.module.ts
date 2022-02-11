import { Module, CacheModule } from '@nestjs/common'
import * as redisStore from 'cache-manager-redis-store'
import { ConfigurationService } from 'src/shared/configuration/configuration.service'
import { RedisCacheService } from './redisCache.service'

@Module({
    imports: [
        CacheModule.register({
            inject: [ConfigurationService],
            useFactory: (config: ConfigurationService) => ({
                store: redisStore,
                host: config.redis_config.host,
                port: config.redis_config.port,
            }),
        }),
    ],
    providers: [RedisCacheService],
    exports: [RedisCacheService],
})
export class RedisCacheModule {}

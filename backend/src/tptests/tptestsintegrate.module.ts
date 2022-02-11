import { HttpModule, Module } from '@nestjs/common'
import { RedisCacheModule } from 'src/redisCache/redisCache.module'
import { TPTestsIntegrateService } from './tptestsintegrate.service'

@Module({
    imports: [
        RedisCacheModule,
        HttpModule.register({
            timeout: 60000,
        })],
    controllers: [],
    providers: [TPTestsIntegrateService],
    exports: [TPTestsIntegrateService]
})
export class TPTestsIntegrateModule { }

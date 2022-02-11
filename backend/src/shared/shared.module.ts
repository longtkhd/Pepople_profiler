import { Module, Global } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigurationService } from './configuration/configuration.service'
import { HttpExceptionFilter } from './http-exception.filter'
import { LoggingInterceptor } from './interceptors/logging.interceptor'
import { MapperService } from './mapper/mapper.service'
import { PinpaymentService } from './pinpayment.service'

@Global()
@Module({
    controllers: [],
    providers: [
        ConfigurationService,
        MapperService,
        PinpaymentService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor
        }
    ],
    exports: [ConfigurationService, MapperService, PinpaymentService]
})
export class SharedModule { }

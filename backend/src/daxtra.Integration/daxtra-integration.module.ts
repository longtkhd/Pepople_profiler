import { DaxtraIntegrationService } from './daxtra-integration.service'
import { forwardRef, HttpModule, Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { CVParsingLog } from 'src/schemas/cvparsing.log'
import { AgencyModule } from 'src/agency/agency.module'

@Module({
    imports: [
        TypegooseModule.forFeature([CVParsingLog]),
        HttpModule.register({
            timeout: 60000,
        }), forwardRef(() => AgencyModule)],
    controllers: [],
    providers: [
        DaxtraIntegrationService,],
    exports: [DaxtraIntegrationService]
})
export class DaxtraIntegrationModule { }

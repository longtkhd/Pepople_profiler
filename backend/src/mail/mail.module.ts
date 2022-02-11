import { MailService } from './mail.service'
import { Module } from '@nestjs/common'
import { MailLogs } from '../schemas/mailLog.schema'
import { AwsModule } from '../aws/aws.module'
import { TypegooseModule } from 'nestjs-typegoose'

@Module({
    imports: [
        TypegooseModule.forFeature([MailLogs]),
        AwsModule
    ],
    controllers: [],
    providers: [
        MailService,],
    exports: [MailService]
})
export class MailModule { }

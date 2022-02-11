import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { MailTemplate } from 'src/schemas/mailTemplate'
import { MailTemplateController } from './mailtemplate.controller'
import { MailTemplateService } from './mailtemplate.service'

@Module({
    imports: [TypegooseModule.forFeature([MailTemplate])],
    controllers: [MailTemplateController],
    providers: [MailTemplateService],
})
export class MailTemplateModule { }

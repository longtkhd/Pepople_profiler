import { UserController } from './user.controller'
import { forwardRef, Module } from '@nestjs/common'
import { UsersService } from './user.service'

import { User } from '../schemas/user.schema'
import { AgencyModule } from '../agency/agency.module'
import { MailModule } from '../mail/mail.module'
import { TokenModule } from '../token/token.module'
import { TypegooseModule } from 'nestjs-typegoose'
import { CsvModule } from 'nest-csv-parser'
@Module({
    imports: [
        TypegooseModule.forFeature([User]),
        forwardRef(() => AgencyModule),
        CsvModule,
        MailModule,
        TokenModule
    ],
    providers: [UsersService],
    exports: [UsersService],
    controllers: [UserController],
})
export class UserModule { }

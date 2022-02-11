import { Global, Module } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { Notification } from 'src/schemas/notification.schema'
import { SocketService } from './socket.service'
import { UserModule } from '../user/user.module'
import { MailModule } from '../mail/mail.module'

@Global()
@Module({
    imports: [
        TypegooseModule.forFeature([Notification]),
        UserModule,
        MailModule,
    ],
    controllers: [NotificationController],
    providers: [NotificationService, SocketService],
    exports: [NotificationService, SocketService],
})
export class NotificationModule { }
